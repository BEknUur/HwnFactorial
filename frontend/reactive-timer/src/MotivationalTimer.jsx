import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';               
import './MotivationalTimer.css';

function MotivationalTimer (){

    const { isDarkTheme, toggleTheme } = useTheme();    
    const [name, setName] = useState(() => {
        return localStorage.getItem('userName') || '';
    });
    const [time, setTime] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [completionCount, setCompletionCount] = useState(() => {
        return parseInt(localStorage.getItem('completionCount')) || 0;
    });
    const [selectedTime, setSelectedTime] = useState(10);
   

    //Последнийй раунд емаа брааат 
    const Emoji = {
        first: '🎯',
        fifth: '🏆',
        tenth: '👑',
        twentieth: '🌟',
        default: '💪'
    };
    
   


    const getAchievementEmoji = () => {                   
        if (completionCount === 1)  return Emoji.first;
        if (completionCount === 5)  return Emoji.fifth;
        if (completionCount === 10) return Emoji.tenth;
        if (completionCount === 20) return Emoji.twentieth;
        return Emoji.default;
    };

    // добавил второй раунд)
    const motivationalPhrases = [
        "Ты тигр браат, {name} ",
        "Брат лучший, {name} ",
        "Крааашсынгой браат, {name} ",
        "Demo Day сенікі ғой брат, {name} ",
        "Все девочки твои брат деее), {name} "
    ];
    const getRandomPhrase = () => {
        const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
        return motivationalPhrases[randomIndex].replace('{name}', name);
    }

    //получается сохранеем имя в локал строадж при изменении
    useEffect(() => {
        localStorage.setItem('userName', name);
    }, [name]);

    useEffect(() => {
        localStorage.setItem('completionCount', completionCount.toString());
    }, [completionCount]);

    // функция для воспроизведение звуука браат
    const playCompletionSound = () => {
        const audio = new Audio('/success.mp3');
        audio.play();
    };

    useEffect(() => {
        let timer ;
        if (isRunning && time > 0){
            timer = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        } else if (time === 0 && isRunning){
            setIsRunning(false);
            setIsFinished(true);
            setCompletionCount(prev => prev + 1);
            playCompletionSound();
           
        }
        return () => clearInterval(timer);
    }, [isRunning, time]);

    const handleStart = () => {
        if (name.trim() !== ""){
            setIsRunning(true);
            setIsFinished(false);
            setTime(selectedTime);
        }
    };
    const handleReset = () => {
        setName("");
        setTime(selectedTime);
        setIsRunning(false);
        setIsFinished(false);
    };
    const handleTryAgain = () => {
        setTime(selectedTime);
        setIsRunning(true);
        setIsFinished(false);
    }

    const progress = ((selectedTime - time) / selectedTime) * 100;

    return (
      
        <div className={`timer-container ${isDarkTheme ? 'dark' : 'light'}`}>
          
            <button onClick={toggleTheme} className="theme-toggle">
                {isDarkTheme ? '☀️' : '🌙'}
            </button>

            {/* это как я понял блок для ввода имени и старта  */}
            {!isRunning && !isFinished && (
                <div className="input-section">
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="name-input"
                    />
                    <select 
                        value={selectedTime} 
                        onChange={(e) => setSelectedTime(Number(e.target.value))}
                        className="time-select"
                    > 
                        <option value={10}>10 секунд</option>
                        <option value={20}>20 секунд</option>
                        <option value={30}>30 секунд</option>
                    </select>
                    <button 
                        onClick={handleStart} 
                        disabled={!name.trim()}
                        className="start-button"
                    >
                        Старт Таймера
                    </button>
                </div>
            )}

            {/* блок с таймерооом прикоол*/}
            {isRunning && (
                <div className="timer-section">
                    <h2>{name}, осталось {time} сек</h2>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
                    
            {/*блок с резалтом*/ }
            {isFinished && (
                <div className="result-section">
                    <h2 className="completion-message">
                        {getAchievementEmoji()} {getRandomPhrase()}
                    </h2>
                    <p className="completion-count">
                        Выполнено раз: {completionCount}
                    </p>
                    <button 
                        onClick={handleTryAgain}
                        className="try-again-button"
                    >
                        Попробовать ещё раз
                    </button>
                </div>
            )}

            {/* получается кнопка для сброса*/ }
            {(isRunning || isFinished) && (
                <button 
                    onClick={handleReset}
                    className="reset-button"
                >
                    Сброс
                </button>
            )}
        </div>
    );
}

export default MotivationalTimer;
