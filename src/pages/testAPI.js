import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

export default function TestAPI() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    try {
      axios
        .get("http://163.50.57.107:300/base_mold?mc_reg=TM-PS-002")
        .then((response) => {
            console.log(response.data);
            setPost(response.data);
        });
    } catch (err) {
      throw err;
    }
  }, []);
  if (!post) return null;
  return(
    <>
        {post.HSR_ID}
    </>
  )
}
