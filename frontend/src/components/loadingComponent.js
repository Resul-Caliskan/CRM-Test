import React from 'react';
import "./style.css";
const Loading = () => {

  return (
    
    <div className="h-screen flex items-center justify-center pb-36">
      { <div className="spinner mb-10"></div> }
    </div>
  );
};

export default Loading;
