# ML Integration Guide for Janta Seva

## Overview
This guide explains how to integrate your own trained ML model with the Janta Seva admin dashboard for automatic report categorization.

## Quick Start

### 1. Setup Python Environment
```bash
# Create virtual environment
python -m venv ml_env
source ml_env/bin/activate  # On Windows: ml_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Start the ML Service
```bash
python ml_service.py
```
The service will start on `http://localhost:8001`

### 3. Test the Service
Visit `http://localhost:8001/docs` for interactive API documentation.

## Integration Steps

### Step 1: Replace Mock Model with Your Trained Model

Replace the `MockMLModel` class in `ml_service.py` with your actual model:

```python
class YourMLModel:
    def __init__(self):
        # Load your trained model
        self.model = load_model("path/to/your/model.pkl")
        self.vectorizer = load_vectorizer("path/to/vectorizer.pkl")
        
    def predict(self, text: str, images: Optional[List[str]] = None) -> dict:
        # Your prediction logic here
        features = self.vectorizer.transform([text])
        prediction = self.model.predict(features)[0]
        confidence = self.model.predict_proba(features).max()
        
        return {
            "category": prediction,
            "confidence": float(confidence),
            "department": self.get_department(prediction),
            "priority": self.get_priority(text, confidence)
        }
```

### Step 2: Configure Frontend Connection

In the frontend ML Integration page:
1. Set the endpoint to `http://localhost:8001/categorize`
2. Test the connection
3. Try categorizing sample reports

### Step 3: Integrate with Report Processing

The ML service can be integrated into the report workflow:

1. **Automatic Categorization**: When new reports are submitted
2. **Department Suggestion**: Auto-suggest departments based on category
3. **Priority Assessment**: Set priority based on confidence and content
4. **Duplicate Detection**: Compare with existing reports

## API Endpoints

### POST /categorize
Main categorization endpoint for reports.

**Request:**
```json
{
  "text": "Large pothole on Main Street causing vehicle damage",
  "images": ["base64_encoded_image_data"]  // optional
}
```

**Response:**
```json
{
  "category": "pothole",
  "confidence": 0.94,
  "department": "Roads & Infrastructure",
  "priority": "high",
  "suggestions": {
    "estimated_resolution": "3-5 days",
    "required_department": "Roads & Infrastructure",
    "follow_up_needed": true
  }
}
```

### GET /health
Health check endpoint.

### GET /categories
Get supported categories and departments.

### GET /stats
Get model statistics and metrics.

## Supported Categories

- **pothole**: Road potholes and surface damage
- **streetlight**: Street lighting issues
- **drainage**: Water logging and drainage problems
- **road**: Road construction and traffic issues
- **other**: General civic issues

## Model Requirements

Your ML model should be able to:

1. **Text Classification**: Classify report descriptions into categories
2. **Confidence Scoring**: Provide prediction confidence (0.0 to 1.0)
3. **Image Analysis** (Optional): Process uploaded images
4. **Priority Detection**: Identify urgent reports based on keywords

## Example Model Integration

### For Scikit-learn Models:
```python
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

class ScikitModel:
    def __init__(self):
        self.model = joblib.load('report_classifier.pkl')
        self.vectorizer = joblib.load('tfidf_vectorizer.pkl')
        
    def predict(self, text: str, images=None):
        features = self.vectorizer.transform([text])
        category = self.model.predict(features)[0]
        confidence = self.model.predict_proba(features).max()
        return {"category": category, "confidence": confidence}
```

### For TensorFlow Models:
```python
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer

class TensorFlowModel:
    def __init__(self):
        self.model = tf.keras.models.load_model('report_classifier.h5')
        self.tokenizer = joblib.load('tokenizer.pkl')
        
    def predict(self, text: str, images=None):
        sequences = self.tokenizer.texts_to_sequences([text])
        padded = tf.keras.preprocessing.sequence.pad_sequences(sequences)
        predictions = self.model.predict(padded)
        category_idx = predictions.argmax()
        confidence = predictions.max()
        return {"category": self.categories[category_idx], "confidence": confidence}
```

### For Hugging Face Models:
```python
from transformers import pipeline

class HuggingFaceModel:
    def __init__(self):
        self.classifier = pipeline(
            "text-classification",
            model="path/to/your/model",
            tokenizer="path/to/your/tokenizer"
        )
        
    def predict(self, text: str, images=None):
        result = self.classifier(text)[0]
        return {
            "category": result['label'],
            "confidence": result['score']
        }
```

## Deployment Options

### Development
```bash
python ml_service.py
```

### Production
```bash
uvicorn ml_service:app --host 0.0.0.0 --port 8001 --workers 4
```

### Docker
```dockerfile
FROM python:3.9
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ml_service.py .
COPY models/ ./models/
EXPOSE 8001
CMD ["uvicorn", "ml_service:app", "--host", "0.0.0.0", "--port", "8001"]
```

## Testing

Test your integration with sample reports:

```bash
curl -X POST "http://localhost:8001/categorize" \
     -H "Content-Type: application/json" \
     -d '{"text": "Street light not working in residential area"}'
```

## Performance Considerations

1. **Model Size**: Keep models under 100MB for faster loading
2. **Response Time**: Aim for < 500ms response time
3. **Batch Processing**: Consider batch endpoints for multiple reports
4. **Caching**: Cache frequent predictions
5. **Monitoring**: Log prediction accuracy and performance metrics

## Security

1. **API Keys**: Implement API key authentication if needed
2. **Rate Limiting**: Add rate limiting for production use
3. **Input Validation**: Validate all inputs thoroughly
4. **HTTPS**: Use HTTPS in production

## Monitoring and Analytics

Track these metrics:
- Prediction accuracy
- Response times
- Category distribution
- Model confidence scores
- Error rates

The frontend ML Integration page provides a dashboard to monitor these metrics.

## Support

For questions or issues with the ML integration, refer to the FastAPI documentation or create an issue in the project repository.