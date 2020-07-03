    $("input[data-type='currency']").on({
        keyup: function () {
            formatCurrency($(this));
        },
        blur: function () {
            formatCurrency($(this), "blur");
        },
        change: function () {
            formatCurrency($(this), "blur");
        }
    });

    function formatNumber(n) {
        // format number 1000000 to 1,234,567
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    function formatCurrency(input, blur) {
        // appends $ to value, validates decimal side
        // and puts cursor back in right position.

        // get input value
        var input_val = input.val();

        // don't validate empty input
        if (input_val === "") {
            return;
        }

        // original length
        var original_len = input_val.length;

        // initial caret position
        var caret_pos = input.prop("selectionStart");

        // check for decimal
        if (input_val.indexOf(".") >= 0) {

            // get position of first decimal
            // this prevents multiple decimals from
            // being entered
            var decimal_pos = input_val.indexOf(".");

            // split number by decimal point
            var left_side = input_val.substring(0, decimal_pos);
            var right_side = input_val.substring(decimal_pos);

            // add commas to left side of number
            left_side = formatNumber(left_side);

            // validate right side
            right_side = formatNumber(right_side);

            // On blur make sure 2 numbers after decimal
            /*if (blur === "blur") {
                right_side += "00";
            }*/

            // Limit decimal to only 2 digits
            right_side = right_side.substring(0, 2);

            // join number by .
            input_val = "$" + left_side + "." + right_side;

        } else {
            // no decimal entered
            // add commas to number
            // remove all non-digits
            input_val = formatNumber(input_val);
            input_val = "$" + input_val;

            // final formatting
            /*if (blur === "blur") {
                input_val += ".00";
            }*/
        }

        // send updated string to input
        input.val(input_val);

        // put caret back in the right position
        var updated_len = input_val.length;
        caret_pos = updated_len - original_len + caret_pos;
        input[0].setSelectionRange(caret_pos, caret_pos);
    }

    function formatCur(input, blur) {
        // appends $ to value, validates decimal side
        // and puts cursor back in right position.

        // get input value
        var input_val = input.toString();

        // don't validate empty input
        if (input_val === "") {
            return;
        }

        // original length

        // initial caret position
        //var caret_pos = input.prop("selectionStart");
        //console.log(input_val)

        // check for decimal
        if (input_val.indexOf(".") >= 0) {

            // get position of first decimal
            // this prevents multiple decimals from
            // being entered
            var decimal_pos = input_val.indexOf(".");

            // split number by decimal point
            var left_side = input_val.substring(0, decimal_pos);
            var right_side = input_val.substring(decimal_pos);

            // add commas to left side of number
            left_side = formatNumber(left_side);

            // validate right side
            right_side = formatNumber(right_side);

            // On blur make sure 2 numbers after decimal
            /*if (blur === "blur") {
                right_side += "00";
            }*/

            // Limit decimal to only 2 digits
            right_side = right_side.substring(0, 2);

            // join number by .
            input_val = "$" + left_side + "." + right_side;

        } else {
            // no decimal entered
            // add commas to number
            // remove all non-digits
            input_val = formatNumber(input_val);
            input_val = "$" + input_val;

            // final formatting
            /*if (blur === "blur") {
                input_val += ".00";
            }*/
        }

        // send updated string to input
        return input_val;

    }

function showHide() {
    var x = document.getElementById("inc_tax_div");
    var morLes = document.getElementById('moreLess')
    if (x.style.display === "none") {
        x.style.display = "block";
        morLes.innerText = 'Less';
    } else {
        x.style.display = "none";
        morLes.innerText = 'More';
    }
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
        n = (n * -1).toFixed(2);
    }
    return n;
}

function percentage(partialValue, totalValue) {
    return roundTo((100 * partialValue) / totalValue, 2);
}

var homePrice = document.getElementById('home_price');
var downPayment = document.getElementById('down_payment');
var propertyTax = document.getElementById('property_tax');
var downPercent = document.getElementById('d_percent');
var homeInsurance = document.getElementById('home_ins')
var loanProgram = document.getElementById('loan_program')
var interestRate = document.getElementById('interest_rate');
var HOA = document.getElementById('hoa_dues')
var propertyTaxpercent = document.getElementById('property_tax_percent')
var includeTax = document.getElementById('inc_tax');

async function morgCalc() {

    function getNoOfYears(loan_program) {
        if (loan_program.value == 'Fixed30Year') {
            return 30
        } else if (loan_program.value == 'Fixed20Year') {
            return 20
        } else if (loan_program.value == 'Fixed15Year') {
            return 15
        }
    }

    async function getAmr(loan_program) {
        var response = await fetch('https://mortgageapi.zillow.com/getCurrentRates?partnerId=RD-CZMBMCZ&queries.rateQuery.program=' + loan_program + '&queries.rateQuery.loanAmountBucket=Conforming&queries.rateQuery.loanToValueBucket=Normal&queries.rateQuery.creditScoreBucket=High');
        var json = await response.json()

        return json.rates.rateQuery.rate;
    }

    function getInterestRate(loan_program) {
        if (loan_program.value == 'Fixed30Year') {
            return getAmr('Fixed30Year')
        } else if (loan_program.value == 'Fixed20Year') {
            return getAmr('Fixed20Year')
        } else if (loan_program.value == 'Fixed15Year') {
            return getAmr('Fixed15Year')
        }
    }

    var h = homePrice.value === ''? 0: homePrice.value.replace('$', '').replace(/,/g, '')
    var hi = homeInsurance.value ===''? 0: homeInsurance.value.replace('$', '').replace(/,/g, '')
    var ho = HOA.value === ''? 0: HOA.value.replace('$', '').replace(/,/g, '')
    var homePriceValue = parseFloat(h)
    var downPaymentValue = parseFloat(homePriceValue) * downPercent.value / 100
    var propertyTaxValue = parseFloat(homePriceValue) * propertyTaxpercent.value / 100
    var homeInsuranceValue = parseFloat(hi)
    var HOAvalue = parseFloat(ho)
    var interestRateValue = await getInterestRate(loanProgram)
    var downPercentValue = parseFloat(downPercent.value)
    var PMI = ((homePriceValue - downPaymentValue) * (0.5 / 100)) / 12
    // console.log(PMI)

    interestRate.value = interestRateValue
    downPayment.value = formatCur(downPaymentValue);
    propertyTax.value = formatCur(Math.round(propertyTaxValue));


    var insurance = homeInsuranceValue / 12.0
    var taxes = propertyTaxValue / 12.0

    var principal = homePriceValue - downPaymentValue
    var noOfPayment = getNoOfYears(loanProgram) * 12
    var monthlyInterestRate = (interestRateValue / 100.0) / 12
    var A = (1 + monthlyInterestRate) ** noOfPayment
    var PnI = principal * ((monthlyInterestRate * A) / (A - 1))

    var Total = includeTax.checked ? (PnI + insurance + taxes + (HOAvalue ? HOAvalue : 0) + (downPercent.value < 20 ? PMI : 0)) : PnI + (downPercent.value < 20 ? PMI : 0);


    d3.select("#donut").selectAll("svg").remove();
    var dataset = []
    if (includeTax.checked) {
        if (downPercentValue < 20) {
            dataset = HOAvalue ? [
                {label: 'Taxes', count: Math.round(taxes)},
                {label: 'Insurance', count: Math.round(insurance)},
                {label: 'P&I', count: Math.round(PnI)},
                {label: 'PMI', count: Math.round(PMI)},
                {label: 'HOA', count: Math.round(HOAvalue)}
            ] : [
                {label: 'Taxes', count: Math.round(taxes)},
                {label: 'Insurance', count: Math.round(insurance)},
                {label: 'PMI', count: Math.round(PMI)},
                {label: 'P&I', count: Math.round(PnI)}
            ]
        } else {
            dataset = HOAvalue ? [
                {label: 'Taxes', count: Math.round(taxes)},
                {label: 'Insurance', count: Math.round(insurance)},
                {label: 'P&I', count: Math.round(PnI)},
                {label: 'HOA', count: Math.round(HOAvalue)}
            ] : [
                {label: 'Taxes', count: Math.round(taxes)},
                {label: 'Insurance', count: Math.round(insurance)},
                {label: 'P&I', count: Math.round(PnI)}
            ]
        }

    } else {
        dataset = (downPercentValue < 20)? [
                {label: 'P&I', count: Math.round(PnI)},
                {label: 'PMI', count: Math.round(PMI)}
                ]:
            [{label: 'P&I', count: Math.round(PnI)}]
    }
    // console.log(dataset, downPercentValue)

    var width = 350,
        height = 350,
        radius = Math.min(width - 50, height - 50) / 2.5;

    // Define arc colours
    var colour = d3.scale.linear()
        .domain([1, 3.5, 6])
        .range(['#33b5b5', '#ed8b69', '#6295cc', '#dd85c0', '#8ecc23', '#fccd06', '#dbba97', '#aaaaaa'])
        .interpolate(d3.interpolateHcl);

    // Define arc ranges
    var arcText = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, .3);

    // Determine size of arcs
    var arc = d3.svg.arc()
        .innerRadius(radius - 50)
        .outerRadius(100);

    // Create the donut pie chart layout
    var pie = d3.layout.pie()
        .value(function (d) {
            return d.count;
        })
        .sort(null);

    // Append SVG attributes and append g to the SVG
    var mySvg = d3.select('#donut').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
        .attr('preserveAspectRatio', 'xMinYMin');

    var svg = mySvg
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var svgText = mySvg
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Define inner circle
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 100)
        .attr("fill", "#fff");


    svg.append("text")
        .attr('y', -10)
        .attr("text-anchor", "middle").style("font-weight", "bold")
        .text('Your payment');

    svg.append("text")
        .attr('y', 15)
        .attr("text-anchor", "middle")
        .style("font-size", "1.5em")
        .text(formatCur(Math.round(Total)));


    // Calculate SVG paths and fill in the colours
    var g = svg.selectAll(".arc")
        .data(pie(dataset))
        .enter().append("g")
        .attr("class", "arc");

    // Append the path to each g
    g.append("path")
        .attr("d", arc)
        //.attr("data-legend", function(d, i){ return parseInt(newData[i].count) + ' ' + newData[i].emote; })
        .attr("fill", function (d, i) {
            return colour(i);
        });

    var textG = svg.selectAll(".labels")
        .data(pie(dataset))
        .enter().append("g")
        .attr("class", "labels");

    // Append text labels to each arc
    /*textG.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function (d, i) {
            return d.data.count > 0 ? d.data.label : '';
        });*/

    var legendG = mySvg.selectAll(".legend")
        .data(pie(dataset))
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
        })
        .attr("class", "legend");

    legendG.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function (d, i) {
            return colour(i);
        });

    legendG.append("text")
        .text(function (d) {
            return formatCur('' + d.value) + "  " + d.data.label;
        })
        .style("font-size", 12)
        .attr("y", 10)
        .attr("x", 16);


}


['change', 'blur', 'keyup', 'keypress'].forEach(function (e) {
    homePrice.addEventListener(e, morgCalc, false);
    downPayment.addEventListener(e, morgCalc);
    loanProgram.addEventListener(e, morgCalc, false);
    HOA.addEventListener(e, morgCalc, false);
    homeInsurance.addEventListener(e, morgCalc, false);
    propertyTaxpercent.addEventListener(e, morgCalc, false);
    propertyTax.addEventListener(e, morgCalc, false);
    includeTax.addEventListener(e, morgCalc, false);
    downPercent.addEventListener(e, morgCalc, false);
})

morgCalc()
