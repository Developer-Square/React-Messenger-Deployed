import React, { Fragment } from "react";
import "./PageLoader.scss";

function PageLoader() {
  return (
    <Fragment>
      <div className="loader-container">
        <div className="loaders">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    </Fragment>
  );
}

export default PageLoader;
