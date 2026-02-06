# API 文档

## AnalysisController

### POST /analysis

分析前端监控数据

**请求体**:

```typescript
{
  "type": "error" | "performance" | "behavior",
  "data": Record<string, any>
}
```

**响应**:

```typescript
{
  "status": "success",
  "message": "string",
  "analysis": {
    "summary": "string",
    "suggestions": string[],
    "severity": "low" | "medium" | "high"
  }
}
```

### POST /analysis/session

分析用户会话数据

**请求体**:

```typescript
{
  "sessionId": "string",
  "events": any[],
  "duration": number
}
```

**响应**:

```typescript
{
  "status": "success",
  "message": "string",
  "analysis": {
    "userBehavior": {
      "actions": string[],
      "patterns": string[]
    },
    "issues": string[],
    "recommendations": string[]
  }
}
```

## AnalysisService

### analyze(data)

分析监控数据

- `data`: 监控数据对象
- 返回: 分析结果

### analyzeSession(sessionData)

分析用户会话

- `sessionData`: 会话数据对象
- 返回: 会话分析结果
