import React from "react";

export default function Loader({ active }) {
  return (
    <div className={`loader ${active}`}>
      <div></div>
    </div>
  );
}
