import React from 'react'

function Nextarrow(props) {
      const { className, style, onClick } = props;
      return (   
            <div
                  className={ className}
                  style={{ ...style, display: "block", background: "#66fcf1", height: "100%" }}
                  onClick={onClick}
            />
      )
}

export default Nextarrow