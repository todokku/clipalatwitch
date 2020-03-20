import React, { useEffect, useState }  from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function ClipSlick(props) {

  let [width, setWidth] = useState(window.innerWidth);

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    const resizeListener = () => {
      // change width from the state object
      setWidth(window.innerWidth)

      console.log(width);
      
      
    };
    // set resize listener
    window.addEventListener('resize', resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener);
    }
  }, [])

    const [slides, setSlides] = useState(1);

    const settings = {
        speed: 200,
        slidesToShow: slides,
        slidesToScroll: slides,
        accessibility: true,
        lazyLoad: true,
        swipeToSlide: true,
      };

      return (
        <div className="center">
          <Slider {...settings} style={ (window.innerWidth < 900) ? {width: ((width*0.79)+"px")} : {width: "100%"}}>
          { (props.clipData) ? props.clipData.clips.map((clip, index) => (
                <div id={clip.id}  key={index}>
                    <iframe src={clip.embed_url + "&autoplay=false"} height="200" width="300" allowFullScreen></iframe>
                </div>
            )) : <div></div>}
          </Slider>
        </div>
      );

}

export default ClipSlick