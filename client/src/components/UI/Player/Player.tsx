import React, {useState, useRef, useEffect} from "react";
import cl from './Player.module.css'
import { API_URL } from "../../../services/APIURL";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

interface Props {
    attachment_id: number | null;
}

const Player: React.FC<Props> = ({attachment_id}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioElement, setAudioElement] = useState<any>(null);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener("timeupdate", () => {
                setCurrentTime(audioElement.currentTime);
                setDuration(audioElement.duration);
            });
        }
      
        return () => {
          if (audioElement) {
            audioElement.removeEventListener("timeupdate", () => {
              setCurrentTime(audioElement.currentTime);
              setDuration(audioElement.duration);
            });
          }
        };
    }, [audioRef, audioElement]);

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
      

    const handlePlay = () => {
        if (audioRef.current) {
            if (!isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
            setIsPlaying(!isPlaying);
        }
    };
      
      
    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className={cl.player} onClick={() => setAudioElement(audioRef)}>
                <div className={cl.controls}>


                    <button className={cl.play_button} onClick={handlePlay}><PlayArrowIcon /></button>
                    <button className={cl.stop_button} onClick={handleStop}><StopIcon /></button>


                    <div className={cl.progress}>



                        <div className={cl.progressBar}>
                            <div
                                className={cl.progressIndicator}
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            ></div>
                        </div>



                        <span className={cl.currentTime}>{formatTime(currentTime)}</span>
                        <span className={cl.slash}>/</span>
                        <span className={cl.duration}>{formatTime(duration)}</span>



                    </div>


                </div>


                <audio ref={audioRef} onLoadedMetadata={handleLoadedMetadata}>
                    <source src={API_URL + "files/download/" + attachment_id} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
    )
}

export default Player;