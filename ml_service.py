# FastAPI ML Service for Report Categorization
# Install: pip install fastapi uvicorn python-multipart pillow

from fastapi import FastAPI, HTTPException, status  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from fastapi.responses import JSONResponse  # type: ignore
from pydantic import BaseModel, field_validator  # type: ignore
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager
import base64
import io
from PIL import Image  # type: ignore
import uvicorn  # type: ignore
import logging
import time
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add startup/shutdown with lifespan (newer FastAPI approach)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Civic-Eye ML Service starting up...")
    logger.info(f"Model loaded with {len(model.categories)} categories")
    logger.info("Service ready to accept requests")
    yield
    # Shutdown
    logger.info("Civic-Eye ML Service shutting down...")

app = FastAPI(
    title="Civic-Eye ML Service", 
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReportRequest(BaseModel):
    text: str
    images: Optional[List[str]] = None  # Base64 encoded images
    
    @field_validator('text')
    @classmethod
    def text_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Text input cannot be empty')
        if len(v) > 5000:  # Limit text length
            raise ValueError('Text input too long (max 5000 characters)')
        return v.strip()
    
    @field_validator('images')
    @classmethod
    def validate_images(cls, v):
        if v and len(v) > 3:
            raise ValueError('Maximum 3 images allowed')
        return v

class CategoryResponse(BaseModel):
    category: str
    confidence: float
    department: str
    priority: str
    suggestions: Dict[str, Any]
    processing_time: float
    timestamp: str

# Mock ML model - Replace with your trained model
class MockMLModel:
    def __init__(self):
        self.categories = ["pothole", "streetlight", "drainage", "road", "other"]
        self.keywords = {
            "pothole": ["pothole", "hole", "road damage", "crack", "bump"],
            "streetlight": ["light", "lamp", "lighting", "bulb", "electricity"],
            "drainage": ["water", "flood", "drain", "sewer", "overflow"],
            "road": ["road", "traffic", "construction", "barrier", "blocked"],
            "other": ["garbage", "noise", "illegal", "encroachment"]
        }
        self.departments = {
            "pothole": "Roads & Infrastructure",
            "streetlight": "Electrical Department", 
            "drainage": "Water & Sanitation",
            "road": "Roads & Infrastructure",
            "other": "General Administration"
        }
    
    def predict(self, text: str, images: Optional[List[str]] = None) -> Dict[str, Any]:
        try:
            start_time = time.time()
            text_lower = text.lower()
            scores = {}
            
            # Simple keyword-based classification (replace with your ML model)
            for category, keywords in self.keywords.items():
                score = sum(1 for keyword in keywords if keyword in text_lower)
                scores[category] = score
            
            # Get category with highest score
            if max(scores.values()) == 0:
                category = "other"
                confidence = 0.6
            else:
                category = max(scores.keys(), key=lambda k: scores[k])
                # Simulate confidence (replace with actual model confidence)
                confidence = min(0.95, 0.6 + (scores[category] * 0.1))
            
            # Determine priority based on keywords
            urgent_keywords = ["urgent", "emergency", "dangerous", "blocking", "overflow", "flood", "accident"]
            medium_keywords = ["broken", "damaged", "not working", "problem"]
            
            if any(word in text_lower for word in urgent_keywords):
                priority = "high"
            elif any(word in text_lower for word in medium_keywords):
                priority = "medium"
            else:
                priority = "low"
            
            # Adjust confidence based on text length and content quality
            word_count = len(text.split())
            if word_count < 3:
                confidence *= 0.8  # Lower confidence for very short texts
            elif word_count > 20:
                confidence *= 1.1  # Higher confidence for detailed reports
                confidence = min(confidence, 0.95)
            
            processing_time = time.time() - start_time
            
            return {
                "category": category,
                "confidence": round(confidence, 3),
                "department": self.departments[category],
                "priority": priority,
                "processing_time": round(processing_time, 3)
            }
            
        except Exception as e:
            logger.error(f"Error in model prediction: {str(e)}")
            raise

# Initialize mock model (replace with your trained model loading)
model = MockMLModel()

@app.get("/")
async def root():
    return {"message": "Civic-Eye ML Service is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/categorize", response_model=CategoryResponse)
async def categorize_report(request: ReportRequest):
    start_time = time.time()
    try:
        logger.info(f"Processing categorization request for text length: {len(request.text)}")
        
        # Process images if provided (basic validation)
        processed_images = []
        if request.images:
            for i, img_data in enumerate(request.images[:3]):  # Limit to 3 images
                try:
                    # Validate base64 format
                    if not img_data.startswith('data:image/'):
                        logger.warning(f"Image {i+1}: Invalid format, skipping")
                        continue
                        
                    # Extract base64 data
                    header, data = img_data.split(',', 1)
                    image_bytes = base64.b64decode(data)
                    
                    # Validate image size (max 10MB)
                    if len(image_bytes) > 10 * 1024 * 1024:
                        logger.warning(f"Image {i+1}: Too large (>10MB), skipping")
                        continue
                        
                    image = Image.open(io.BytesIO(image_bytes))
                    # Convert to RGB if necessary
                    if image.mode not in ('RGB', 'L'):
                        image = image.convert('RGB')
                    processed_images.append(image)
                    logger.info(f"Successfully processed image {i+1}: {image.size}")
                    
                except Exception as e:
                    logger.error(f"Error processing image {i+1}: {str(e)}")
                    continue
        
        # Get prediction from model
        prediction = model.predict(request.text, processed_images)
        
        # Add additional suggestions
        suggestions = {
            "estimated_resolution": get_estimated_resolution(prediction["category"]),
            "required_department": prediction["department"],
            "follow_up_needed": prediction["priority"] == "high",
            "images_processed": len(processed_images),
            "recommended_actions": get_recommended_actions(prediction["category"], prediction["priority"])
        }
        
        total_processing_time = time.time() - start_time
        
        result = CategoryResponse(
            category=prediction["category"],
            confidence=prediction["confidence"],
            department=prediction["department"],
            priority=prediction["priority"],
            suggestions=suggestions,
            processing_time=round(total_processing_time, 3),
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"Categorization completed: {prediction['category']} ({prediction['confidence']}%) in {total_processing_time:.3f}s")
        return result
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

def get_estimated_resolution(category: str) -> str:
    resolution_times = {
        "pothole": "3-5 days",
        "streetlight": "1-2 days", 
        "drainage": "5-7 days",
        "road": "7-14 days",
        "other": "2-5 days"
    }
    return resolution_times.get(category, "3-5 days")

def get_recommended_actions(category: str, priority: str) -> List[str]:
    """Get recommended actions based on category and priority"""
    actions = {
        "pothole": ["Take photos of damage", "Measure dimensions", "Check traffic impact"],
        "streetlight": ["Verify electrical safety", "Check nearby lights", "Note timing of failure"],
        "drainage": ["Assess water level", "Check for blockages", "Monitor weather conditions"],
        "road": ["Document traffic impact", "Check alternative routes", "Assess safety measures"],
        "other": ["Gather additional evidence", "Contact relevant authorities", "Document thoroughly"]
    }
    
    base_actions = actions.get(category, actions["other"])
    
    if priority == "high":
        base_actions.insert(0, "Immediate response required")
    elif priority == "low":
        base_actions.append("Schedule for routine maintenance")
        
    return base_actions

@app.get("/categories")
async def get_categories():
    return {
        "categories": model.categories,
        "departments": model.departments
    }

@app.get("/stats")
async def get_model_stats():
    return {
        "model_version": "1.0.0",
        "supported_categories": len(model.categories),
        "accuracy": 0.89,  # Replace with actual model metrics
        "total_predictions": 1250  # Replace with actual stats
    }

# Add error handler for unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred"}
    )

if __name__ == "__main__":
    print("Starting Civic-Eye ML Service...")
    print("API Documentation: http://localhost:8001/docs")
    print("Health Check: http://localhost:8001/health")
    print("Categories: http://localhost:8001/categories")
    print("Stats: http://localhost:8001/stats")
    
    # Run with better configuration for development
    uvicorn.run(
        "ml_service:app", 
        host="0.0.0.0", 
        port=8001,
        reload=False,  # Disable reload to avoid the warning
        log_level="info"
    )