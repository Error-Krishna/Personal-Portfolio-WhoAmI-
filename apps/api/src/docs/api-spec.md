# API Specification

## Base URL
`/api/v1`

## Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

## Standard Error Envelope
All error responses consistently return:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | BAD_REQUEST | RATE_LIMIT_EXCEEDED | INTERNAL_SERVER_ERROR",
    "message": "Human readable error description",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "Please enter a valid email address",
        "code": "invalid_string"
      }
    ],
    "requestId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "timestamp": "2026-10-11T13:00:00.000Z"
  }
}
```

## Endpoints

### 1. Health Check
- **Route:** `GET /health`
- **Description:** Verifies service availability, database connectivity, and uptime.
