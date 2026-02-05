function App() {
  return (
    <div className="App">
      <h1>AI 前端监控 - 示例项目</h1>
      <p>这是一个测试监控SDK的示例应用</p>
      <button
        onClick={() => {
          console.log('点击按钮');
          throw new Error('测试错误');
        }}
      >
        测试错误
      </button>
    </div>
  );
}

export default App;
