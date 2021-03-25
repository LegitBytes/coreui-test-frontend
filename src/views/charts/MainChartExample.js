import React, { useEffect, useState } from "react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import axios from "axios";
import Auth from "@aws-amplify/auth";

const brandSuccess = getStyle("success") || "#4dbd74";
const brandInfo = getStyle("info") || "#20a8d8";
const brandDanger = getStyle("danger") || "#f86c6b";

const MainChartExample = (attributes) => {
  const [score, setScore] = useState([]);
  const [temp, setTemp] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [timeStamp, setTimeStamp] = useState([]);


  const [accessKey, setAccessKey] = useState(null)

  useEffect(() => {

    Auth.currentSession()
    .then((data)=>{
      setAccessKey(data.getIdToken().getJwtToken())
    })
    .catch((err)=>{
      console.warn(err);
    })
  }, [])

  // https://39jpo50a3f.execute-api.us-east-2.amazonaws.com/dev/getdata/{key_value}

  // https://a6qlgnoyp3.execute-api.us-east-2.amazonaws.com/dev/getdata/${attributes.keyvalue}


  useEffect(() => {
    axios
      .get(`  https://39jpo50a3f.execute-api.us-east-2.amazonaws.com/dev/getdata/${attributes.keyvalue}`,{
        headers:{
          'Authorization': accessKey,
          'Content-Type': 'application/json',
        }
      })
      .then((res) => {
        setScore(res.data.score);
        setTemp(res.data.temp);
        setHumidity(res.data.humidity);
        setTimeStamp(res.data.timestamp);
        // console.log("Here should be header",res.headers);
      });
  }, [attributes.keyvalue,accessKey]);

  const data4 = [];
  if (attributes.keyvalue === "Month") {
    for (let i = 0; i < timeStamp.length; i++) {
      let d = new Date(timeStamp[i]);
      let weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      let n = weekday[d.getDay()];

      data4.push(n);
    }
  } else if (attributes.keyvalue === "Day") {
    for (let i = 0; i < timeStamp.length; i++) {
      let getDate = new Date(timeStamp[i]).toLocaleTimeString();

      data4.push(getDate);
    }
  } else if (attributes.keyvalue === "Year") {
    for (let i = 0; i < timeStamp.length; i++) {
      let month = new Date(timeStamp[i]).getMonth();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let curMonth = monthNames[month];
      data4.push(curMonth);
    }
  }

  const defaultDatasets = (() => {
    const data1 = [];
    const data2 = [];
    const data3 = [];
    for (let i = 0; i < score.length; i++) {
      data1.push(parseFloat(score[i]));
      data2.push(parseFloat(temp[i]));
      data3.push(parseFloat(humidity[i]));
    }

    return [
      {
        label: "Score",
        backgroundColor: hexToRgba(brandInfo, 10),
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        data: data1,
      },
      {
        label: "Temperature",
        backgroundColor: "transparent",
        borderColor: brandSuccess,
        pointHoverBackgroundColor: brandSuccess,
        borderWidth: 2,
        data: data2,
      },
      {
        label: "Humidity",
        backgroundColor: "transparent",
        borderColor: brandDanger,
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5],
        data: data3,
      },
    ];
  })();

  const defaultOptions = (() => {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
              display:false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              autoSkip: true,
              stepSize: Math.ceil(250 / 5),
              // max: 10,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };
  })();

  // render
  return (
    <CChartLine
      {...attributes}
      datasets={defaultDatasets}
      options={defaultOptions}
      labels={data4}
    />
  );
};

export default MainChartExample;
