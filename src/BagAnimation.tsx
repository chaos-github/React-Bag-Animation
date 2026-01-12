import { useEffect, useRef, useState } from "react";
// @ts-ignore - apng-js 可能沒有 TypeScript 類型定義
import parseAPNG from "apng-js";
import { ChevronDown } from "lucide-react";
import { defaultAnimationFrames, defaultImagePath } from "./assets";

export interface BagAnimationProps {
  doneFunction: () => void;
  // 动画帧图片路径数组（4张图片：旋转、未打开、撕开、打开）
  // 如果不提供，将使用打包在组件中的默认图片（路径：/assets/bag/...）
  frames?: string[];
  // 默认显示的图片（未开始动画时显示）
  // 如果不提供，将使用打包在组件中的默认图片（路径：/assets/bag.png）
  defaultImage?: string;
  // 默认图片的 alt 文本
  defaultImageAlt?: string;
  // 是否显示点击提示
  hasChances?: boolean;
  // 提示文本
  swipeHintText?: string;
  // 盒子打开时的文本
  boxOpeningText?: string;
  // 点击提示文本
  clickHintText?: string;
  // 跳过动画文本
  skipAnimationText?: string;
  // 是否显示遮罩层（黑色模糊背景），默认 true
  showMask?: boolean;
  // 遮罩层的透明度（0-1），默认 0.7
  maskOpacity?: number;
  // 遮罩层的模糊程度（px），默认 8
  maskBlur?: number;
  // 容器类名
  className?: string;
}

export default function BagAnimation({ 
  doneFunction,
  frames = defaultAnimationFrames,
  defaultImage = defaultImagePath,
  defaultImageAlt = "Weedza Mystery Box",
  swipeHintText = "Swipe to open",
  boxOpeningText = "Box Opening...",
  clickHintText = "Click to open",
  skipAnimationText = "Skip Animation",
  hasChances = false,
  showMask = true,
  maskOpacity = 0.7,
  maskBlur = 8,
  className = ""
}: BagAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [frame, setFrame] = useState(0);
  const [isPausedAtThird, setIsPausedAtThird] = useState(false);
  const [thirdFrameProgress, setThirdFrameProgress] = useState(0); // 0-100
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const apngRefs = useRef<Array<any>>([]);
  const animationRefs = useRef<Array<any>>([]);
  const thirdFramePlayerRef = useRef<any>(null);
  const thirdFrameCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const thirdFrameApngRef = useRef<any>(null);
  const thirdFrameOriginalSizeRef = useRef<{ width: number; height: number } | null>(null);
  const hasTriggeredFourthFrame = useRef<boolean>(false);

  // Use props for images
  const mysteryBoxImage = defaultImage;
  const mysteryBoxAlt = defaultImageAlt;

  // 當拖曳進度達到指定%時，切換到第四張
  const percentageToFrameLast = 70;

  // 當 isAnimating 變為 true 時，重置到第一張
  useEffect(() => {
    if (isAnimating) {
      setFrame(0);
      setIsPausedAtThird(false);
      setThirdFrameProgress(0);
      setShowSwipeHint(true);
      hasTriggeredFourthFrame.current = false;
    } else {
      // 停止所有動畫
      animationRefs.current.forEach(anim => {
        if (anim) anim.stop();
      });
    }
  }, [isAnimating]);

  // 加載並播放 APNG
  useEffect(() => {
    if (!isAnimating || !canvasRef.current || !hasChances) {
        return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 當 frame == 2 時，立即清除 canvas，避免顯示上一幀的內容
    if (frame == 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 加載當前 frame 的 APNG
    const loadAPNG = async () => {
      try {
        const response = await fetch(frames[frame]);
        const arrayBuffer = await response.arrayBuffer();
        
        // 使用 parseAPNG 解析（異步函數）
        const apng = await parseAPNG(arrayBuffer);
        
        if (apng instanceof Error) {
          console.error('Failed to parse APNG:', apng);
          return;
        }

        // 設置 canvas 尺寸
        canvas.width = apng.width;
        canvas.height = apng.height;

        // 保存 APNG 引用
        apngRefs.current[frame] = apng;

        // 先創建圖像（必須步驟）
        await apng.createImages();

        // 獲取播放器（getPlayer 返回 Promise）
        const player = await apng.getPlayer(ctx);
        
        // 播放 APNG，只播放一次
        let isStopped = false;
        let stopFunction: (() => void) | null = null;

        // 如果是第三張APNG（frame 2），不播放，直接渲染第一幀並等待用戶拖曳
        if (frame === 2) {
          // 保存第三張的引用以便後續控制
          thirdFramePlayerRef.current = player;
          thirdFrameCtxRef.current = ctx;
          thirdFrameApngRef.current = apng;
          // 保存原始尺寸，確保不會改變
          thirdFrameOriginalSizeRef.current = {
            width: apng.width,
            height: apng.height
          };
          
          // 清除 canvas 並直接渲染第一幀（不調用 play）
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 手動渲染第一幀（frame index 0）
          if (apng.frames && apng.frames.length > 0) {
            const firstFrame = apng.frames[0];
            try {
              // 獲取圖像元素
              // @ts-ignore - apng-js 的 Frame 類型定義可能不完整
              const img = firstFrame.imageElement || firstFrame.image;
              
              if (img && img instanceof HTMLImageElement) {
                // 當 clampedFrameIndex == 0 時，繪製整個圖像
                ctx.drawImage(img, 0, 0, apng.width, apng.height);
              }
            } catch (error) {
              console.error('Error rendering first frame:', error);
            }
          }
          
          // 設置狀態
          setIsPausedAtThird(true);
          setThirdFrameProgress(0);
          
          // 保存停止函數（雖然不會播放，但為了清理）
          // @ts-ignore
          if (player.stop) {
            // @ts-ignore
            stopFunction = player.stop.bind(player);
          }
          
          // 保存動畫引用以便清理
          animationRefs.current[frame] = {
            stop: () => {
              isStopped = true;
              if (stopFunction) {
                stopFunction();
              }
            }
          };

        } else {
          // 其他幀正常播放
          // 計算總播放時間（所有幀的延遲時間總和）
          let totalDuration = 0;

          for (let i = 0; i < apng.frames.length; i++) {
            const frameDelay = apng.frames[i].delay || 100;
            totalDuration += frameDelay; // 轉換為毫秒
          }

          if (frame == 1) {
            totalDuration -= 200;
          }

          // 使用 player.play() 方法播放，只播放一次
          // @ts-ignore - apng-js 的 Player 類型定義可能不完整
          player.play(1); // 1 表示只播放一次
          
          // 保存停止函數（如果有的話）
          // @ts-ignore
          if (player.stop) {
            // @ts-ignore
            stopFunction = player.stop.bind(player);
          }
          
          // 保存動畫引用以便清理
          animationRefs.current[frame] = {
            stop: () => {
              isStopped = true;
              if (stopFunction) {
                stopFunction();
              }
            }
          };
          
          // 其他幀正常播放完成後切換
          const timeoutId = setTimeout(() => {
            if (!isStopped) {
              // APNG 播放完成
              if (frame < frames.length - 1) {
                // 切換到下一張
                console.log("stop frame: " + frame);
                // 先停止當前動畫
                if (stopFunction) {
                  stopFunction();
                }
                // 如果下一幀是 frame 2（需要停止等待拖曳），先清除 canvas
                // if (frame + 1 === 2 && canvasRef.current) {
                //   const nextCanvas = canvasRef.current;
                //   const nextCtx = nextCanvas.getContext('2d');
                //   if (nextCtx && nextCanvas.width && nextCanvas.height) {
                //     nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
                //   }
                // }
                setFrame(frame + 1);
              } else {
                // 最後一張播放完成，結束動畫
                endAnimation();
              }
            }
          }, totalDuration);

          // 更新停止函數以清理 timeout
          const originalStop = animationRefs.current[frame].stop;
          animationRefs.current[frame].stop = () => {
            isStopped = true;
            clearTimeout(timeoutId);
            if (stopFunction) {
              stopFunction();
            }
            originalStop();
          };
        }

      } catch (error) {
        console.error('Error loading APNG:', error);
      }
    };

    loadAPNG();

    // 清理函數
    return () => {
      if (animationRefs.current[frame]) {
        animationRefs.current[frame].stop();
      }
    };
  }, [frame, isAnimating, doneFunction]);

  // 根據進度渲染第三張的特定幀
  useEffect(() => {
    if (isPausedAtThird && thirdFrameCtxRef.current && thirdFrameApngRef.current && thirdFramePlayerRef.current && canvasRef.current && thirdFrameOriginalSizeRef.current) {
      const apng = thirdFrameApngRef.current;
      const ctx = thirdFrameCtxRef.current;
      const canvas = canvasRef.current;
      const player = thirdFramePlayerRef.current;
      const originalSize = thirdFrameOriginalSizeRef.current;
      
      // 強制設置 canvas 內部尺寸為原始尺寸，每次渲染前都確保正確
      canvas.width = originalSize.width;
      canvas.height = originalSize.height;
      
      // 根據進度計算應該顯示的幀索引
      const totalFrames = apng.frames.length;
      // 使用更精確的計算，確保能顯示最後一幀（當進度100%時）
      const targetFrameIndex = Math.floor((thirdFrameProgress / 100) * totalFrames);
      const clampedFrameIndex = Math.min(Math.max(0, targetFrameIndex), totalFrames - 1);
      
      // 渲染對應的幀
      if (apng.frames[clampedFrameIndex]) {
        try {
          // 完全重置 canvas 狀態
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          
          // 先完全清除 canvas
          ctx.clearRect(0, 0, originalSize.width, originalSize.height);
          
          // 使用 player 的 render 方法來渲染特定幀
          // @ts-ignore - apng-js 的 Player 類型定義可能不完整
          if (player.render && typeof player.render === 'function') {
            // 在 render 之前再次確保尺寸正確
            if (canvas.width !== originalSize.width || canvas.height !== originalSize.height) {
              canvas.width = originalSize.width;
              canvas.height = originalSize.height;
            }
            // @ts-ignore
            player.render(apng.frames[clampedFrameIndex]);
          } else {
            // 如果沒有 render 方法，嘗試直接使用圖像元素
            const frame = apng.frames[clampedFrameIndex];
            // @ts-ignore
            if (frame.imageElement && frame.imageElement instanceof HTMLImageElement) {
              // 使用圖像的原始尺寸，不要強制縮放
              // @ts-ignore
              const img = frame.imageElement;

              ctxDrawSwipeFrames(ctx, img, clampedFrameIndex, originalSize);
            } else if (frame.image && frame.image instanceof HTMLImageElement) {
              // 使用圖像的原始尺寸，不要強制縮放
              // @ts-ignore
              const img = frame.image;

              ctxDrawSwipeFrames(ctx, img, clampedFrameIndex, originalSize);
            } else {
              // 嘗試調用 render（即使類型定義不完整）
              // 在 render 之前再次確保尺寸正確
              if (canvas.width !== originalSize.width || canvas.height !== originalSize.height) {
                canvas.width = originalSize.width;
                canvas.height = originalSize.height;
              }
              // @ts-ignore
              player.render(apng.frames[clampedFrameIndex]);
            }
          }
          
          ctx.restore();
        } catch (error) {
          console.error('Error rendering frame:', error);
        }
      }
    }
  }, [thirdFrameProgress, isPausedAtThird]);

  // 繪製撕開動畫的函數
  const ctxDrawSwipeFrames = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, clampedFrameIndex: number, originalSize: { width: number; height: number }) => {
 
    let buttonGapPercentage = 0;
    let startX = originalSize.width * 0.30685;
    let startY = originalSize.height - (originalSize.height * buttonGapPercentage + img.height);

    if (clampedFrameIndex == 0) {
      ctx.drawImage(img, 0, 0, originalSize.width, originalSize.height);
    } else if (clampedFrameIndex == 1 || clampedFrameIndex == 2) {
      ctx.drawImage(img, startX, startY, img.width, img.height);
    } else if (clampedFrameIndex == 3) {
      ctx.drawImage(img, startX, startY, img.width, img.height);
    } else if (clampedFrameIndex == 4) {
      ctx.drawImage(img, startX, startY, img.width, img.height);
    } else if (clampedFrameIndex == 5) {
      ctx.drawImage(img, startX, startY, img.width, img.height);
    }
  }

  // 結束動畫
  const endAnimation = () => {
    setFrame(0);
    setIsAnimating(false);
    doneFunction();
  }
  // 拖曳開始
  const onMouseDown = (e: React.MouseEvent) => {
    if (isPausedAtThird && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // 記錄起始位置（相對於 canvas 左邊緣）
      const touchGap = e.clientX - rect.left;

      // 立即更新進度，讓拖曳更靈敏
      const initialProgress = Math.max(0, Math.min(100, (touchGap / rect.width) * 100));
      setThirdFrameProgress(initialProgress);
      // 隱藏提示
      setShowSwipeHint(false);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPausedAtThird || !canvasRef.current || hasTriggeredFourthFrame.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX;
    // 使用相對於 canvas 左邊緣的位置
    const relativeX = currentX - rect.left;
    const canvasWidth = rect.width;

    // 計算進度（0-100），基於滑鼠在 canvas 上的相對位置
    // 使用更精確的計算，確保能達到 100%
    const progress = Math.max(0, Math.min(100, (relativeX / canvasWidth) * 100));
    
    // 立即更新進度
    setThirdFrameProgress(progress);
    
    // 如果達到或超過指定%，繼續播放第四張（降低閾值確保觸發）
    if (progress >= percentageToFrameLast && !hasTriggeredFourthFrame.current) {
      hasTriggeredFourthFrame.current = true;
      setIsPausedAtThird(false);
      setThirdFrameProgress(0);
      // 直接切換到第四張，不使用 setTimeout
      setFrame(3);
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (isPausedAtThird) {
      // 放開時保持當前進度，停止拖曳
      setThirdFrameProgress(0);
      setShowSwipeHint(true);
    }
  };

//   console.log("hasChances: " + hasChances);
//   console.log("isAnimating: " + isAnimating);

  return (
    <>
    <div className={`flex w-full relative justify-center items-center ${className}`}>
    {/* Click text and Floating Arrow - positioned to align with red line and avoid bouncing outside area */}
    {!isAnimating && hasChances && (
        <div className="absolute top-4 left-[calc(50%-0px)] transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="flex flex-col items-center animate-bounce">
            <p
              className="font-bold text-lg md:text-xl mb-1 drop-shadow-lg"
            >
              {clickHintText}
            </p>
            <ChevronDown
              className={`h-8 w-8 md:h-10 md:w-10 text-lime-500 drop-shadow-lg ${className}`}
              strokeWidth={4}
            />
          </div>
        </div>
    )}

    {isAnimating && hasChances && (
      <>
        {/* 遮罩层 - 黑色模糊背景 */}
        {showMask && (
          <div
            className="fixed inset-0 z-[99]"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${maskOpacity})`,
              backdropFilter: `blur(${maskBlur}px)`,
              WebkitBackdropFilter: `blur(${maskBlur}px)`, // Safari 支持
            }}
            onClick={(e) => {
              // 点击遮罩层不关闭动画，防止误触
              e.stopPropagation();
            }}
          />
        )}
        
        {/* 动画内容 - 居中显示 */}
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp} // 當滑鼠離開時也觸發 mouseUp
              onTouchStart={(e) => {
                if (isPausedAtThird && canvasRef.current) {
                  // e.preventDefault();
                  const touch = e.touches[0];
                  const rect = canvasRef.current.getBoundingClientRect();
                  const touchGap = touch.clientX - rect.left;
                  const initialProgress = Math.max(0, Math.min(100, (touchGap / rect.width) * 100));
                  setThirdFrameProgress(initialProgress);
                  // 隱藏提示
                  setShowSwipeHint(false);
                }
              }}
              onTouchMove={(e) => {
                if (!isPausedAtThird || !canvasRef.current || hasTriggeredFourthFrame.current) return;
              //   e.preventDefault();
                const touch = e.touches[0];
                const rect = canvasRef.current.getBoundingClientRect();
                const relativeX = touch.clientX - rect.left;
                const canvasWidth = rect.width;
                const progress = Math.max(0, Math.min(100, (relativeX / canvasWidth) * 100));
                
                // 立即更新進度
                setThirdFrameProgress(progress);
                
                // 如果達到或超過指定%，繼續播放第四張
                if (progress >= percentageToFrameLast && !hasTriggeredFourthFrame.current) {
                  hasTriggeredFourthFrame.current = true;
                  setIsPausedAtThird(false);
                  setThirdFrameProgress(0);
                  // 直接切換到第四張
                  setFrame(3);
                }
              }}
              onTouchEnd={(e) => {
                if (isPausedAtThird) {
                  e.preventDefault();
                  setThirdFrameProgress(0);
                  setShowSwipeHint(true);
                }
              }}
              className="select-none cursor-pointer w-full h-full object-contain"
              style={{ 
                imageRendering: 'pixelated', 
                cursor: isPausedAtThird ? 'grab' : 'pointer',
                touchAction: 'none', // 防止默認觸摸行為
                userSelect: 'none', // 防止選中
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            {isPausedAtThird && showSwipeHint && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm md:text-base font-medium animate-pulse pointer-events-none z-20">
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                  <span>{swipeHintText}</span>
                </div>
              </div>
            )}
            {frame === 3 && (
                <div onClick={() => {
                  endAnimation();
                }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm md:text-base font-medium animate-pulse cursor-pointer z-20">
                  <span>{skipAnimationText}</span>
                </div>
              )
            }
          </div>
        </div>

        <div className="fixed z-[101] top-0 left-0 w-full h-[10%] flex justify-center items-center">
          <p className="animate-pulse text-sm md:text-base text-center z-[101]">
            {boxOpeningText}
          </p>
        </div>
      </>
    )}
    {
        <img
        src={mysteryBoxImage}
        alt={mysteryBoxAlt}
        onClick={() => {
          if (hasChances) {
            setIsAnimating(true);

          } else {
            endAnimation();
          }
        }}
        className={`w-36 h-36 md:w-96 md:h-96 object-contain relative ${hasChances ? 'mt-24' : 'mt-8'} transition-all duration-200 ease-out cursor-pointer z-10 hover:scale-105 active:scale-95 md:hover:scale-110 md:active:scale-90`}
        />
    }
    </div>
    </>
    
  );
}
