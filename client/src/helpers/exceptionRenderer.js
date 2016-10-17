import { RedBoxError } from 'redbox-react';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';

const redBoxStyles = {
  redbox: {
    boxSizing: 'border-box',
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    width: '100%',
    zIndex: 9999,
    overflowX: 'scroll',
  },
  message: {
    textTransform: 'uppercase',
    WebkitAnimation: 'blink-animation 2s steps(5, start) infinite',
    animation: 'blink-animation 2s steps(5, start) infinite'
  },
  stack: {
    marginTop: '2em'
  },
  frame: {
    marginTop: '1em'
  },
  file: {
    marginTop: 5,
    fontSize: '16px',
    color: '#3d54a9'
  },
  linkToFile: {
    textDecoration: 'none',
    color: '#3d54a9'
  }
};

function template(redboxString, preface = null) {

  let prefaceString;
  if(preface) {
    prefaceString = `
      <div class="preface">
        ${preface}
      </div>
    `;
  }

  return `<!doctype html>
  <head>
    <style type="text/css">
      @font-face {
        font-family: "C64ProMono";
        src: url("/static/font/c64/c64-pro-mono.eot");
        src: url("/static/font/c64/c64-pro-mono.eot?#iefix") format("embedded-opentype"),
             url("/static/font/c64/c64-pro-mono.woff") format("woff"),
             url("/static/font/c64/c64-pro-mono.ttf") format("truetype");
      }
      @keyframes blink-animation {
        to {
          visibility: hidden;
        }
      }
      @-webkit-keyframes blink-animation {
        to {
          visibility: hidden;
        }
      }
      html {
        height: 100%;
      }
      body {
        border: 50px solid #6076c5;
        background: #20398d;
        margin: 0;
      }
      .preface {
        margin-bottom: 25px;
        background-color: #6076c5;
        color: #20398d;
        font-size: 18px;
        display: inline-block;        
        text-transform: uppercase;
      }
      .wrapper {
        font-family: 'C64ProMono';
        color: #6076c5;
        text-align: left;
        font-size: 16px;
        padding-bottom: 10px;
      }
      .message {
        text-align: center;
        margin-top: 10px;
        line-height: 2em;
        margin-bottom: 50px;
      }
    </style>
  </head>
  <body class="body">
    <div class="wrapper">
      <div class="message">
        **** MANIFOLD 64 SCHOLARSHIP V2 ****
        <br />
        64K RAM SYSTEM 38911 BASIC BYTES FREE
      </div>
      <div class="bluebox">
        ${prefaceString}
        ${redboxString}
      </div>
    </div>
    <script type="text/javascript"> 
      var bodyHeight = document.body.offsetHeight;
      var windowHeight = window.innerHeight;
      if (bodyHeight < windowHeight) {
        document.body.style.height = (windowHeight - 100) + "px";
      }
    </script>    
  </body>`;
}

export default function renderException(error, preface) {
  const pretty = new PrettyError();
  let redboxString;
  try {
    redboxString = ReactDOM.renderToString(
      <RedBoxError style={redBoxStyles} error={error} />
    );
  } catch(exception) {
    console.log(exception);
  }
  const out = template(redboxString, preface);
  return out;
}
