import React, { useState, useEffect } from "react";
import axios from "axios";

const Test_image = () => {
    const [image,setImage] = useState()
    axios.get('http://localhost:300/svoe_list/image')
    .then((res) =>{
        console.log(res.data.IMG_DETAIL.data)
        const base64String = btoa(String.fromCharCode(...new Uint8Array(res.data.IMG_DETAIL.data)));
        // const file = new Blob(
        //     [new Uint8Array(res.data)],
        //     {
        //       type: "image/jpeg",
        //     }
        //   );
          
          setImage(base64String);


        
    })
    return(
        <>
        <img src = {`data:image/png;base64,${image}`} alt='imag'/>
        </>
    )
}

export default Test_image