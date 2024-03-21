// RenderCircularProgressBar.js dosyası

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const RenderCircularProgressBar = ({ percentage }) => (
    <div className="circular-progressbar-container">
        <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
                rotation: 0,
                textSize: '24px',
                pathTransitionDuration: 0.5,
                pathColor: percentage > 90 ? 'rgba(0, 255, 0, 1)' :
                    percentage >= 80 ? 'rgba(0, 150, 0, 1)' :
                    percentage >= 70 ? 'rgba(50, 150, 0, 1)' :
                        percentage >= 60 ? 'rgba(160, 160, 0, 1)' :
                        percentage <= 30 ? 'rgba(160, 0, 0, 1)' :
                            'rgba(255, 165, 0, 1)',
                textColor: percentage > 90 ? 'rgba(0, 255, 0, 1)' :
                    percentage >= 80 ? 'rgba(0, 150, 0, 1)' :
                    percentage >= 70 ? 'rgba(0, 150, 0, 1)' :
                        percentage >= 60 ? 'rgba(160, 160, 0, 1)' :
                        percentage <= 30 ? 'rgba(160, 0, 0, 1)' :
                            'rgba(255, 165, 0, 1)',
                trailColor: '#d6d6d6',
                backgroundColor: '#3e98c7',
            })}
            

        />
    </div>
);

export default RenderCircularProgressBar;
