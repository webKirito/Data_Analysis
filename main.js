function loadFromFile(_url) {

    var b;

    $.ajax({
        url: _url,
        async: false,
        cache: false,
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            b = data;
        }
    });

    var dataArr = b.split("\n");

    dataArr.forEach(function (element) {
        element = +(element);
    }, this);

    dataArr.sort(function (a, b) {
        return a - b;
    });

    return dataArr;
}

class Row {

    constructor(arr) {
        this.arr = arr;
    }

    getRow() {
        return this.arr;
    }


    setRow(newArr) {
        this.arr = newArr;
    }

    getCL() {
        return console.log(this.arr);
    }

    getList() {
        for (var i = 1; i < this.arr.length + 1; i++) {
            alert(i.toString() + ") " + this.arr[i].toString());
        }
    }

    getAverage(){
        var sum = 0;
        for (var i = 0; i < this.arr.length; i++) {
            sum += +this.arr[i];
        }
        return sum / this.arr.length;
    }

    getMed() {
        var res = 0;
        if (this.arr.length % 2 == 1) {
            return +this.arr[(this.arr.length+1)/2 - 1];  
        } else {
            return  1/2 * (+this.arr[(this.arr.length)/2 - 1] + +this.arr[(this.arr.length)/2] );
        } 
        
    }

    getBiasedDispersion(){
        var sum = 0;
        var _x = this.getAverage()
        for (var i = 0; i < this.arr.length; i++) {
            sum += Math.pow(+this.arr[i] - _x, 2);
        }
        return sum/this.arr.length;
    }

    getUnbiasedDispersion(){
        var sum = 0;
        var _x = this.getAverage()
        for (var i = 0; i < this.arr.length; i++) {
            sum += Math.pow(+this.arr[i] - _x, 2);
        }
        return sum/(this.arr.length-1);
    }
    

    getBiasedMSD(){
        return Math.sqrt(this.getBiasedDispersion());
    }

    getUnbiasedMSD(){
        return Math.sqrt(this.getUnbiasedDispersion());
    }

    getPirsonKoef() {
        return this.getUnbiasedMSD() / this.getAverage();
    }

    getBiasedAssymetryKoef() {
        var sum = 0;
        var _x = this.getAverage();

        for (var i = 0; i < this.arr.length; i++) {
            sum += Math.pow(+this.arr[i] - _x, 3);
        }
        return sum /(this.arr.length * Math.pow(this.getBiasedMSD(),3));

    }

    getUnbiasedAssymetryKoef(){
        var n = this.arr.length;
        return this.getBiasedAssymetryKoef()*(Math.sqrt(n * n - n))/(n - 2);
    }

    getBiasedExcessKoef() {
        var sum = 0;
        var _x = this.getAverage();

        for (var i = 0; i < this.arr.length; i++) {
            sum += Math.pow(+this.arr[i] - _x, 4);
        }
        return sum /(this.arr.length * Math.pow(this.getBiasedMSD(),4));
    }

    getUnbiasedExcessKoef() {
        var n = this.arr.length;

        return (n*n - 1) / ((n - 2) * (n - 3)) * (this.getBiasedExcessKoef() - 3 + 6 / (n + 1));
    }

    getContrExcessKoef(){
        return 1/Math.sqrt(this.getBiasedExcessKoef());
    }

    getU(a) {

        const c0 = 2.512517,
            c1 = 0.802853,
            c2 = 0.010328,
            d1 = 1.432788,
            d2 = 0.1892659,
            d3 = 0.001308;


        if (a <= 0.5) {
            var t = Math.sqrt(-2 * Math.log(a));
            var q = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
            return -q;
        } else {
            var t = Math.sqrt(-2 * Math.log(1 - a));
            var q = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
            return q;
        }
    }

    getQuantile(a) {
        var tmp = this.arr.length - 1;
        function normal(a) {

            const c0 = 2.512517 , c1 = 0.802853 , c2 = 0.010328,
                  d1 = 1.432788 , d2 = 0.1892659 , d3 = 0.001308;

            
            if (a <= 0.5) {
                var t = Math.sqrt(-2*Math.log(a));
                var q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
                return -q;
            } else {
                var t = Math.sqrt(-2*Math.log(1-a));
                var q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
                return q;
            }
        }
        function student(a, b) {
            var v = b;
            var up = normal(a);
            function g1(up) {
                return 1/4 * (up*up*up + up);
            }
            function g2(up) {
                return 1/96 * (5 * Math.pow(up, 5) + 16 * Math.pow(up, 3) + 3 * up);
            }
            function g3(up) {
                return 1/384 * (3 * Math.pow(up, 7) + 19 * Math.pow(up, 5) + 17 * Math.pow(up, 3) - 15 * up);

            }
            function g4(up) {
                return 1/92160 * (79 * Math.pow(up, 9) + 779*Math.pow(up, 7) + 1482 * Math.pow(up, 5) - 1920* Math.pow(up, 3) - 945 * up);
            }

            return up + 1 / Math.pow(v, 1) * g1(up) + 1 / Math.pow(v, 2) *g2(up) + 1 / Math.pow(v, 3) * g3(up) + 1 / Math.pow(v, 4) * g4(up);

        }

        if(this.arr.length > 60) {
            return normal(a);
        } else {
            return student(a,tmp);
        }


    }

    getAAnomalBorder(a){
        return this.getAverage() - this.getU(a) * this.getUnbiasedMSD();
   }

    getBAnomalBorder(a){
        return this.getAverage() + this.getU(a) * this.getUnbiasedMSD();
    }

    getAverageConfidenceInterval(a){
        var d_x = this.getUnbiasedMSD() / Math.sqrt(this.arr.length);
        return d_x * this.getQuantile(a);
    }

    getUnbiasedDispersionConfidenceInterval(a) {
        var d_s = this.getUnbiasedMSD() / Math.sqrt(2 * this.arr.length);
        return d_s * this.getQuantile(a);
    }

    getPirsonKoefConfidenceInterval(a) {
        var d_w = this.getPirsonKoef() * Math.sqrt((1 + 2 * this.getPirsonKoef()*this.getPirsonKoef()) / (2 * this.arr.length));
        return d_w * this.getQuantile(a);
    }

    getUnbiasedAssymetryKoefConfidenceInterval(a){
        var d_a = Math.sqrt(1/(6 * this.arr.length) * (1 - 12/(2 * this.arr.length + 7)));
        return d_a * this.getQuantile(a);
    }

    getUnbiasedExcessKoefConfidenceInterval(a){
        var d_e = Math.sqrt(24/(this.arr.length) * (1 - (225)/(15 * this.arr.length + 124)));
        return d_e * this.getQuantile(a);
    }

    getContrExcessKoefConfidenceInterval(a){ 
        var d_ce = Math.sqrt(this.getBiasedExcessKoef()/(29 * this.arr.length)) * Math.pow(Math.abs(this.getBiasedExcessKoef() * this.getBiasedExcessKoef() - 1),3/4);
        return d_ce * this.getQuantile(a);
    }

    getAlpha(a) {
       return 1 - a/2; 
    }



    getFruequencyTable() {
        Array.prototype.quantify = function () {
            this.sort(function (a, b) {
                return a - b;
            });
            var obj = {};
            //obj={}
            for (var el, i = 0; i < this.length; ++i)

                if (el = this[i]) {
                    if (!obj[el]) {
                        obj[el] = 1;
                    } else {
                        ++obj[el];
                    }
                }


            return obj;

        }
        var tmp = this.arr.quantify();
        var list = [];
        for (var elem in tmp) {
            list.push(new Value(elem, tmp[elem]));
        }

        var sum = 0.0;
        var cdfArr = [list.length];
        for (var i = 0; i < list.length; i++) {
            sum += list[i].getNumber()/this.arr.length;
            cdfArr[i] = sum;
        }
        var count = [list.length];
        for (var i = 0; i < list.length; i++) {
            count[i] = list[i].getVal();
        }
        this.count = count;

        $('.container').append( 
            `<tr>
                <th>Number</th>
                <th>Value</th>
                <th>Frequency</th>
                <th>Absolute frequency</th>
                <th>CDF value</th>
            </tr>`)

        for (var i = 0; i < list.length; i++) {
            $('.container').append( 
                "<tr>"+"<td>" + ( i + 1) +"</td>" + "<td>" + list[i].getVal() + "</td>" + "<td>" + list[i].getNumber() +"</td>"+ "<td>" +
                list[i].getNumber() / this.arr.length + "</td>"+"<td>"+ cdfArr[i] +"</td>" +"</tr>" );
            }
        this.cdfArr = cdfArr;
    }

    getMin() {
        return Math.min.apply(null, this.arr);
    }

    getMax() {
        return Math.max.apply(null, this.arr);
    }

    getNumberOfClasses() {
        if (this.arr.length < 100) {
            if (Math.round(Math.sqrt(this.arr.length)) % 2 == 0) {
                return Math.round(Math.sqrt(this.arr.length)) - 1;  
            } else {
                return  Math.round(Math.sqrt(this.arr.length));
            } 
        }
        if (this.arr.length >= 100) {
            if (Math.round(Math.pow(this.arr.length, 1/3)) % 2 == 0) {
                return Math.round(Math.pow(this.arr.length, 1/3)) - 1;  
            } else {
                return  Math.round(Math.pow(this.arr.length, 1/3));
            } 
        }
        
    }

    getStep(){
        var a = Math.min.apply(null, tmpArr);
        var b = Math.max.apply(null, tmpArr);
        return (b-a)/this.arr.length;
    }

    getCDF(){
        return cdfArr;
    }

    getListLessA(a){
        var a = this.getAAnomalBorder(a);
        var list = [];
        for (var i = 0; i < this.arr.length; i++){
            if(this.arr[i] <= a) {
                list.push(this.arr[i]);
            }
        }
        return list;
    }

    getListMoreB(a){
        var b = this.getBAnomalBorder(a);
        var list = [];
        for (var i = 0; i < this.arr.length; i++){
            if(this.arr[i] >= b) {
                list.push(this.arr[i]);
            }
        }
        return list;
    }

    getArrWithoutAnomalData(){
        var newArr = this.arr;
        var al = this.getListLessA(this.getAlpha(0.05));
        var bl = this.getListMoreB(this.getAlpha(0.05));
        for (var i = 0; i < al.length ; i++){
            newArr = newArr.filter(item => item !== al[i]);    
        }
        for (var i = 0; i < bl.length ; i++){
            alert(bl[i]);
            newArr = newArr.filter(item => item !== bl[i]);    
        }
        
        // alert(newArr);

        this.arr = newArr;

        

    }

}


class Value {
    constructor(a, b) {
        this.a = +a;
        this.b = +b;
    }
    getVal() {
        return this.a;
    }
    getNumber() {
        return this.b;
    }
}



function test(tmpArr , numberOfClasses){
    try {

function CreateClasses() {
    if (numberOfClasses == "") {
        var n = row.getNumberOfClasses();
    } else {
        var n = +$("#nClasses").val();
    }
    var a = Math.min.apply(null, tmpArr);
    var b = Math.max.apply(null, tmpArr);
    var x = CreateBorders(n, a, b);
    var seq = [n];
   
    for (var i = 0; i < n ; i++) {
        seq[i] = 0;
        for (var j = 0; j < tmpArr.length; j++) {

            if ((tmpArr[j] <= x[i + 1]) & (tmpArr[j] >= x[i])) {
                seq[i]++;
            }

        }

    }
    
    return seq;
}

function CreateBorders(n, a, b) {
    var arr = [n + 1];
    for (var i = 0; i <= n; i++) {
        arr[i] = a + i * (b - a) / n ;
    }
    return arr;

}






//Working with tables and data


    
    

    var row = new Row(tmpArr);
    row.getFruequencyTable();
    if (numberOfClasses == "") {
        var n = row.getNumberOfClasses();
    } else {
        var n = +$("#nClasses").val();
    }
    var a = CreateClasses();
    var x = CreateBorders(n, row.getMin(), row.getMax());
    
    
    
    
    var sum = 0;
    var cdfClassArr = [n];
    
    
    for (var i = 0; i < n; i++) {
        sum += a[i]/tmpArr.length;
        cdfClassArr[i] = sum;
    }

    $(".class-container").append("<tr><th>Class</th><th>Elements count</th><th>Class borders</th><th>Absolute frequency</th><th>CDF value</th></tr>");

    for (var i = 0; i < n; i++) {
        $('.class-container').append(
            "<tr>" + "<td>"  + (i + 1) +
            "</td>" + "<td>" + a[i] + "</td>" +
            "<td>" + "[" + x[i] + " ; " + x[i + 1] + " )" + "</td>" +
            "<td>" + a[i] / tmpArr.length + "</td>" +"<td>"+ cdfClassArr[i] +"</td>"+ "</tr>");
    }
    
    var a = row.getAlpha(+$("#alphaProb").val());

    
    
    $('.characteristics-container').append(
        "<tr><th>Сharacteristic</th><th>Value</th><th>RMS</th><th>Right Confidence Value</th><th>Left Confidence Value</th></tr>"+
        "<tr>" + "<td>" + "Average" + "</td>" + "<td>" + row.getAverage() + "</td>" + "<td>"+ row.getAverageConfidenceInterval(a)/row.getQuantile(a) +"</td>" + "<td>" + (row.getAverage() - row.getAverageConfidenceInterval(a)) + "</td>" + "<td>"+ (row.getAverage() + row.getAverageConfidenceInterval(a)) +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Mediana" + "</td>" + "<td>" + row.getMed() + "</td>" + "<td>"+"" +"</td>" + "<td>" +"" + "</td>" + "<td>"+ ""+"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Biased Dispersion" + "</td>" + "<td>" + row.getBiasedDispersion() + "</td>" + "<td>"+ "" +"</td>" + "<td>" + ""+ "</td>" + "<td>"+"" +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Unbiased Dispersion" + "</td>" + "<td>" + row.getUnbiasedDispersion() + "</td>" + "<td>"+ row.getUnbiasedDispersionConfidenceInterval(a)/row.getQuantile(a) +"</td>" + "<td>" + (row.getUnbiasedDispersion() - row.getUnbiasedDispersionConfidenceInterval(a)) + "</td>" + "<td>"+(row.getUnbiasedDispersion() + row.getUnbiasedDispersionConfidenceInterval(a)) +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Pirson Variation" + "</td>" + "<td>" + row.getPirsonKoef()+ "</td>" + "<td>"+ row.getPirsonKoefConfidenceInterval(a)/row.getQuantile(a)+"</td>" + "<td>" +(row.getPirsonKoef() - row.getPirsonKoefConfidenceInterval(a)) + "</td>" + "<td>"+(row.getPirsonKoef() + row.getPirsonKoefConfidenceInterval(a)) +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Biased Assymetry Сoefficient" + "</td>" + "<td>" + row.getBiasedAssymetryKoef()+ "</td>" + "<td>"+ "" +"</td>" + "<td>" + "" + "</td>" + "<td>"+ "" +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Unbiased Assymetry Сoefficient" + "</td>" + "<td>" + row.getUnbiasedAssymetryKoef()+ "</td>" + "<td>"+ row.getUnbiasedAssymetryKoefConfidenceInterval(a) / row.getQuantile(a)+"</td>" + "<td>" + (row.getUnbiasedAssymetryKoef() - row.getUnbiasedAssymetryKoefConfidenceInterval(a)) + "</td>" + "<td>"+ (row.getUnbiasedAssymetryKoef() + row.getUnbiasedAssymetryKoefConfidenceInterval(a)) +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Biased Excess Сoefficient" + "</td>" + "<td>" + row.getBiasedExcessKoef() + "</td>" + "<td>"+ ""+"</td>" + "<td>" + "" + "</td>" + "<td>"+ "" +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Unbiased Excess Сoefficient" + "</td>" + "<td>" + row.getUnbiasedExcessKoef() + "</td>" + "<td>"+ row.getUnbiasedExcessKoefConfidenceInterval(a)/row.getQuantile(a) +"</td>" + "<td>" + (row.getUnbiasedExcessKoef()-row.getUnbiasedExcessKoefConfidenceInterval(a)) + "</td>" + "<td>"+ (row.getUnbiasedExcessKoef() + row.getUnbiasedExcessKoefConfidenceInterval(a)) +"</td>" + "</tr>" +
        "<tr>" + "<td>" + "Contrexcess Сoefficient" + "</td>" + "<td>" + row.getContrExcessKoef()+ "</td>" + "<td>"+ row.getContrExcessKoefConfidenceInterval(a)/row.getQuantile(a)+"</td>" + "<td>" + (row.getContrExcessKoef() - row.getContrExcessKoefConfidenceInterval(a)) + "</td>" + "<td>"+ (row.getContrExcessKoef() + row.getContrExcessKoefConfidenceInterval(a)) +"</td>" + "</tr>" 
    );

    var aL = row.getListLessA(a);
    var bL = row.getListMoreB(a);

    $(".error-container").append(
        "<tr>" + "<th>" + "A = " +new Row(tmpArr).getAAnomalBorder(a) + "</th>" + "<th>" + "B = " +  new Row(tmpArr).getBAnomalBorder(a) + "</th>" + "</tr>"
    );
    
    


    var aL = row.getListLessA(a);
    var bL = row.getListMoreB(a);
    console.log(aL.length);
    
    for (var i = 0 ; i < bL.length ; i++){
        if (aL[i] === undefined) {
            aL[i] = "";
        }
        if (bL[i] === undefined) {
            bL[i] = "";
        }
        $(".error-container").append(
            "<tr>" + "<th>"  + aL[i] + "</th>" + "<th>" + bL[i] + "</th>" + "</tr>"
        );
    }
    
    
    function z(arr, b = row.getAverage()) {
        var list = [];
        var tmp = row.arr;
        for (var i = 0 ; i < arr.length-1; i++) {
            if (tmp[i] < b) {
                list.push(Math.log(2*arr[i]));
            } else {
                list.push(-Math.log(2*(1 - arr[i])));
            }
            
            
        }
        return list;
    }


    $("#laplasResult").append("<div>" + row.getUnbiasedAssymetryKoef() + "</div>" +
    "<div>" +row.getUnbiasedExcessKoef() + "</div>");
    
    
        
    
    
    
    
    //Building functional plots
    
    
    
    
    
    
    
    
    var x1 = tmpArr;
    var trace1 = {
      x: x1,
      name: 'control',
      autobinx: false, 
      histnorm: 'probability', 
      marker: {
        color: "rgba(255, 100, 102, 0.7)", 
        line: {
          color:  "rgba(255, 100, 102, 1)", 
          width: 1
        }
      },  
      opacity: 0.5, 
      type: "histogram", 
      xbins: {
        end: row.getMax() + (row.getMax()-row.getMin())/n, 
        size: (row.getMax()-row.getMin())/n, 
        start: row.getMin() - (row.getMax()-row.getMin())/n
      }
    };
    var data = [trace1];
    var layout = {
      //bargap: 0.05, 
      //bargroupgap: 0.2, 
      height: 471,
      width: 802,
      barmode: "overlay", 
      title: "Histogram", 
      xaxis: {
       title: "Value",
       range: [row.getMin(),row.getMax()]
      }, 
      yaxis: {title: "Probability"}
    };
    Plotly.newPlot('histogram', data, layout);
    
    var x1 = tmpArr;
    var trace1 = {
      x: x1,
      name: 'control',
      autobinx: false, 
      histnorm: 'probability', 
      marker: {
        color: "rgba(0, 253, 0, 0.2)", 
        line: {
          color:  "rgba(0, 141, 0, 1)", 
          width: 1
        }
      },  
      opacity: 0.5, 
      type: "histogram", 
      xbins: {
        end: row.getMax() , 
        size: (row.getMax()-row.getMin())/n, 
        start: row.getMin()
      },
      cumulative: {enabled: true}
    };
    var data = [trace1];
    var layout = {
      //bargap: 0.05, 
      //bargroupgap: 0.2, 
      height: 471,
      width: 802,
      barmode: "overlay", 
      title: "Classes CDF", 
      xaxis: {
       title: "Class",
       range: [row.getMin(),row.getMax()]
      }, 
      yaxis: {title: "Probability"}
    };
    Plotly.newPlot('c-cdf', data, layout);
    
    
    



         trace1 = {
             x: row.count,
             y: row.cdfArr,
             name: 'linear',
             type: 'scatter',
             mode:"lines+markers",
             line:{
                 shape:'vh',
                 color:"green"
             },marker:{
                 color:"red",
                 size:5
             }
             ,
             uid: '45198a'
         };
         data = [trace1];
         layout = {
             autosize: true,
             height: 471,
             width: 802,
             title: "Data CDF", 
             xaxis: {
                 autorange: true,
                 range: [2, 18],
                 title: 'Classes',
                 type: 'linear'
             },
             yaxis: {
                 autorange: true,
                 range: [-0.0404762055556, 1.05476190556],
                 title: 'CDF (%) ',
                 type: 'linear'
             }
         };
         Plotly.newPlot('plotly-div', {
             data: data,
             layout: layout
         });    

         
         
         console.log(row.cdfArr + "\n" + row.arr + "average" + row.getAverage() );
         trace1 = {
            x: row.arr,
            y: z(row.cdfArr),
            name: 'linear',
            type: 'scatter',
            mode:"lines+markers",
            line:{
                shape:'linear',
                color:"green"
            },marker:{
                color:"red",
                size:5
            }
        };
        data = [trace1];
        layout = {
            autosize: true,
            height: 471,
            width: 802,
            title: "Laplas Function Identifying", 
            xaxis: {
                autorange: true,
                range: [2, 18],
                title: 't',
                type: 'linear'
            },
            yaxis: {
                autorange: true,
                range: [-0.0404762055556, 1.05476190556],
                title: 'z(t) ',
                type: 'linear'
            }
        };
        Plotly.newPlot('log', {
            data: data,
            layout: layout
        });
         
    
        } catch (err) {
            console.log(err);
            alert(err);
}



}

function clear(){
    $(".container").empty();
    $(".error-container").empty();
    $(".class-container").empty();
    $(".characteristics-container").empty();
    
}

clear();



$("#nClasses").val("");


test(loadFromFile("cdf/500/lapl.txt"),$("#nClasses").val());

var castil;

$("#n-25").click(
    function () {
        clear();
        test(loadFromFile("cdf/25/norm.txt"), $("#nClasses").val());
    }
);

$("#n-25").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/25/norm.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});



$("#v-25").click(
    function () {
        clear();
        test(loadFromFile("cdf/25/veib.txt"), $("#nClasses").val());
    }
);
$("#v-25").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/25/veib.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});



$("#u-25").click(
    function () {
        clear();
        test(loadFromFile("cdf/25/ravn.txt"), $("#nClasses").val());
    }
);

$("#u-25").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/25/ravn.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});



$("#e-25").click(
        function () {
            clear();
            test(loadFromFile("cdf/25/exp.txt"), $("#nClasses").val());
        }
    );

$("#e-25").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/25/exp.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#n-70").click(
    function () {
        clear();
        test(loadFromFile("cdf/70/norm.txt"), $("#nClasses").val());
    }
);

$("#n-70").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/70/norm.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#e-70").click(
    function () {
        clear();
        test(loadFromFile("cdf/70/exp.txt"), $("#nClasses").val());
    }
);

$("#e-70").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/70/veib.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#v-70").click(
    function () {
        clear();
        test(loadFromFile("cdf/70/veib.txt"), $("#nClasses").val());
    }
);

$("#v-70").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/70/veib.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#l-70").click(
    function () {
        clear();
        test(loadFromFile("cdf/70/lapl.txt"), $("#nClasses").val());
    }
);

$("#l-70").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/70/lapl.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#m-70").click(
    function () {
        clear();
        test(loadFromFile("cdf/70/smes.txt"), $("#nClasses").val());
    }
);

$("#m-70").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/70/smes.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#u-70").click(
    function () {
        clear();
        test(loadFromFile("cdf/70/ravn.txt"), $("#nClasses").val());
    }
);

$("#u-70").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/70/ravn.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#n-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/norm.txt"), $("#nClasses").val());
    }
);

$("#n-500").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/500/norm.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#e-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/exp.txt"), $("#nClasses").val());
    }
);

$("#e-500").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/500/exp.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#v-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/veib.txt"), $("#nClasses").val());
    }
);

$("#v-500").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/500/veib.txt");
    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#u-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/ravn.txt"), $("#nClasses").val());
    }
);

$("#u-500").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/500/ravn.txt");

    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#l-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/lapl.txt"), $("#nClasses").val());
    }
);

$("#l-500").dblclick(function () {
    clear();
    if (castil == undefined) {
        castil = loadFromFile("cdf/500/lapl.txt");

    }

    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#m-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/smes.txt"), $("#nClasses").val());
        castil = undefined;
    }
);

$("#m-500").dblclick(function () {
    clear();
    // var q = new Row(loadFromFile("cdf/500/smes.txt"), $("#nClasses").val());
    // q.getArrWithoutAnomalData();
    // test(q.getRow(), $("#nClasses").val());
    
    if (castil == undefined) {
        castil = loadFromFile("cdf/500/smes.txt");
        
    }
    // castil = loadFromFile("cdf/500/lapl.txt");
    var arr = castil;

    var q = new Row(arr, $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
    castil = q.getRow();
});

$("#p-500").click(
    function () {
        clear();
        test(loadFromFile("cdf/500/paretto1.txt"), $("#nClasses").val());
    }
);

$("#p-500").dblclick(function () {
    clear();
    var q = new Row(loadFromFile("cdf/500/paretto1.txt"), $("#nClasses").val());
    q.getArrWithoutAnomalData();
    test(q.getRow(), $("#nClasses").val());
});






















$( "#cdfs" ).click(function() {
    $( ".cc1" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#number" ).click(function() {
    $( ".cc4" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#alpha").click(function() {
    $( ".cc5" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#tables").click(function() {
    $( ".tc" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#graphics").click(function() {
    $( ".gc" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});






$( "#var-row-button" ).click(function() {
    $( ".tables1" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#class-row-button" ).click(function() {
    $( ".tables2" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#char-row-button" ).click(function() {
    $( ".tables3" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#error-element-button" ).click(function() {
    $( ".tables4" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#histogram-button" ).click(function() {
    $( ".graphic1" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});

$( "#cdf-button" ).click(function() {
    $( ".graphic2" ).toggle(
        function() {
            $(this).animate({ 
                height:"0px"
            }, 500);
        },
        function() {
            $(this).animate({ 
                height:"100wh"
            }, 500);
        });
});


console.log(.6 + .04);





