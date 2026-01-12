import React, { useState } from 'react';
import { BagAnimation } from '../src/index';
import { useEffect } from 'react';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHasChances, setIsHasChances] = useState(true);

  const handleDone = () => {
    console.log('Animation completed!');
    setIsAnimating(false);
  };

  useEffect(() => {
    if (isAnimating) {
      document.querySelector('img')?.click();
    }
  }, [isAnimating]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="text-white text-center mb-8 text-4xl drop-shadow-lg">
          Bag Animation UI - 开发预览
        </h1>
        
        {/* Tailwind 测试 - 如果这个框显示正确，说明 Tailwind 工作正常 */}
        <div className="bg-blue-500 text-white p-4 rounded-lg mb-4 text-center">
          <p className="font-bold">Tailwind 测试：如果这个框是蓝色背景白色文字，说明 Tailwind 正常工作 ✅</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>控制面板</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => {
                if (isHasChances) {
                  setIsAnimating(true);
                }
              }}
              disabled={isAnimating}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: isAnimating ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
              }}
            >
              {isAnimating ? '动画播放中...' : '开始动画'}
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setIsHasChances(!isHasChances)}
              disabled={isAnimating}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: isHasChances ? '#667eea' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isHasChances ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
              }}
            >
              {isHasChances ? '有機會' : '沒有機會'}
            </button>
          </div>

          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '6px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <p><strong>状态：</strong> {isAnimating ? '播放中' : '待机'}</p>
            <p><strong>说明：</strong> 点击上方按钮开始动画，动画会在画面中央全屏显示，背景会有黑色模糊遮罩。</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <BagAnimation
            doneFunction={handleDone}
            className="text-gold"
            hasChances={isHasChances}
          />
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginTop: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>功能说明</h2>
          <ul style={{ lineHeight: '1.8', color: '#666' }}>
            <li>✅ 全屏遮罩层：动画会在画面中央全屏显示</li>
            <li>✅ 黑色模糊背景：背景有半透明黑色遮罩和模糊效果</li>
            <li>✅ APNG 动画：支持 4 帧动画播放</li>
            <li>✅ 交互式拖拽：第三帧支持鼠标/触摸拖拽</li>
            <li>✅ 自动完成：动画播放完成后自动调用回调函数</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

