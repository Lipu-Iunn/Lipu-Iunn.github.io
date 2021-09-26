function getData(number, ii) {
    let requestURL = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/' + number + '?Authorization=CWB-E4F1D002-A8D9-4D75-BD78-1225002ACF49&downloadType=WEB&format=JSON';
    // XMLHttpRequest：專門與伺服器連線的物件。
    let req = new XMLHttpRequest();
    req.open('get', requestURL);
    req.send();  //送出連線。
    req.onload = function(e) {  // load事件，偵測連線的狀態結束
        // console.log(this.responseText);
        const data = JSON.parse(this.responseText);
        exeMap(data, ii);
    };
}


function exeMap(data, ii) {
    if (ii == 0){
        var map = L.map('map', {
            center: [24.9976, 121.4420],
            zoom: 9
        });
        var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var stnLocations = new L.MarkerClusterGroup().addTo(map);
    };

    let stnData = data.cwbopendata.location;
    for (let i = 0; i < stnData.length; i++) {
        let lat = stnData[i].lat_wgs84;
        let lon = stnData[i].lon_wgs84;
        let locationName = stnData[i].locationName;
        let stationId = stnData[i].stationId;
        let ht = stnData[i].weatherElement[0].elementValue.value + ' m';
        let time = stnData[i].time.obsTime;
        let p = stnData[i].weatherElement[5].elementValue.value + ' hPa';
        let t = stnData[i].weatherElement[3].elementValue.value + ' &deg;C';
        let rh = stnData[i].weatherElement[4].elementValue.value * 100 + ' %';
        let wd = stnData[i].weatherElement[1].elementValue.value + ' &deg;';
        let ws = stnData[i].weatherElement[2].elementValue.value + ' m/s';
        let pp = stnData[i].weatherElement[6].elementValue.value + ' mm';
        let info = 
            '<html>' +
            '<b>測站名稱： ' + locationName + ' (' + stationId + ')</b><br>' +
            '高度： ' + ht + '<br>' +
            '觀測時間： ' + time + '<p>' +
            '氣壓： ' + p + '<br>' +
            '溫度： ' + t + '<br>' + 
            '相對溼度： ' + rh + '<br>' + 
            '風向： ' + wd + '<br>' + 
            '風速： ' + ws + '<br>' +
            '日累積雨量： ' + pp + '<br>'
            '</html>'
        stnLocations.addLayer(L.marker([lat, lon]).bindPopup(info))
    }
    map.addLayer(stnLocations);
};

number = ['O-A0001-001', 'O-A0003-001'];
for (let i = 0; i < number.length; i++) {
    console.log(i);
    getData(number[i], i);
}
// stnData = stnData.cwbopendata.location
