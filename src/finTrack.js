
class ChartClass{

static{
    Chart.defaults.color = '#f8fafc';
    Chart.defaults.font.family='Lato';
    Chart.defaults.font.size=16;
}

static ctx = document.getElementById('myPieChart');
static tx = document.getElementById('myBarChart');

static pieChart= new Chart(this.ctx, {
    type: 'pie',
    data: {
        labels: ['Food', 'Rent', 'Utilities', 'Transportation', 'Entertainment'],
        datasets: [{
            data:[],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ]
        }]
    }
});

static barChart= new Chart(this.tx, {
    type: 'bar',   
    data: {
        labels:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Monthly Expenses',
            data: [],
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            
        }]
        
    },
    options:{
        scales:{
            x:{
                grid:{
                    color:'rgba(255, 255, 255,0.2)'
                }
            },
            y:{
                grid:{
                    color:'rgba(255, 255, 255,0.2)'
                }
            }
        }
    }
    
});
}

calculateAmount();

function updatePieChart(newPieData){
    ChartClass.pieChart.data.datasets[0].data= newPieData;
    ChartClass.pieChart.update();
}

function updateBarChart(newBarData){
    ChartClass.barChart.data.datasets[0].data= newBarData;
    ChartClass.barChart.update();
}

function updateTotalMonthlyExpenses(totalMonthlyExpenses){
    if(totalMonthlyExpenses<=0) document.getElementById("totalExpenses").textContent= "-";
    document.getElementById("totalExpenses").textContent="$"+totalMonthlyExpenses;

}

function updateMaxAmount(maxAmount,maxAmountCategory){
    if(maxAmount<=0) document.getElementById("maxAmountID").textContent= "-";
    document.getElementById("maxAmountID").textContent=maxAmountCategory+": "+"$"+maxAmount.toString();
}

function updateTable(tableArray){
    const keys=["date","description","category","amount"];
    const rows=document.querySelectorAll("#tableBody tr");
    if(tableArray.length==0){
        for(let i=0; i<rows.length; i++){
            const cell=rows[i].querySelectorAll("td");
            keys.forEach((key,j)=>{
                if(cell[j]){
                    cell[j].textContent="-";
                }
            })
        }
    }
    tableArray.forEach((object,i)=>{
        const row=rows[i];
        if(!row) return;
        const cell=row.querySelectorAll("td");
        keys.forEach((key,j)=>{
            if(cell[j]){
                cell[j].textContent=object[key];
            }
        })

    })
}

document.getElementById("budget-add-button").addEventListener("click",()=>{
    document.getElementById("dialogId").showModal();
})

const budgetForm = document.getElementById("budget-form");
    budgetForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const inputData= new FormData(e.target);
        const data=Object.fromEntries(inputData.entries());
        if(data.budget.trim()!==""){
            localStorage.setItem("budget", JSON.stringify(data));
        }
        document.getElementById("dialogId").close();
        e.target.reset()
        calculateAmount();
})

document.getElementById("dialog-close-button").addEventListener("click",()=>{
    document.getElementById("dialogId").close();
})

document.getElementById("reset-everything-button").addEventListener("click",()=>{
    const checkReset=confirm("Are you sure you want to RESET?")
    if(checkReset==true){
        localStorage.clear();
        calculateAmount();
    }
})

function progressBar(totalAmount){
    const progressBarDiv=document.getElementById("filler-progress-bar");
    let budget;
    try{
        const budgetArr=JSON.parse(localStorage.getItem("budget"));
        budget=budgetArr?.budget || 0;
    }
    catch(error){
        console.log("Error in localStorage-Budget");
    }
    let percent=0;
    if(budget>0){
        percent=(totalAmount/budget)*100;
    }
    else{
        progressBarDiv.style.width=percent+"%";
        return;
    }
    percent=Math.max(0,Math.min(100,percent));
    progressBarDiv.style.width=percent+"%";
    if(percent>60){
        progressBarDiv.style.backgroundColor="orange";
    }
    if(percent>80){
        progressBarDiv.style.backgroundColor="red";
    }
    progressBarDiv.textContent=Math.floor(percent)+"%";
}

function calculateAmount(){
    const arr=JSON.parse(localStorage.getItem("allExpenses")) || [];
    let maxAmount=0;
    let maxAmountCategory="";
    let totalAmount=0;
    const now = new Date();
    const currentMonth=now.getMonth();
    let barChartArray=new Array(12).fill(0);
    let tableArray=new Array();
    let monthlyChartArray= new Array(5).fill(0);
    for(let i=0; i<arr.length; i++){
        const dateStr=arr[i].date;
        const dateArr=dateStr.split("-");
        const monthIndex=parseInt(dateArr[1])-1;
        if(arr[i].category==="Food" && currentMonth==monthIndex ){
            monthlyChartArray[0]+=parseInt(arr[i].amount);
            tableArray.push(arr[i]);
            if(parseInt(arr[i].amount) > maxAmount){
                maxAmount=parseInt(arr[i].amount);
                maxAmountCategory=arr[i].category;
            }
        }
        else if(arr[i].category==="Rent" && currentMonth==monthIndex){
            monthlyChartArray[1]+=parseInt(arr[i].amount);
            tableArray.push(arr[i]);
            if(parseInt(arr[i].amount) > maxAmount){
                maxAmount=parseInt(arr[i].amount);
                maxAmountCategory=arr[i].category;
            }

        }
        else if(arr[i].category==="Utilities" && currentMonth==monthIndex){
            monthlyChartArray[2]+=parseInt(arr[i].amount);
            tableArray.push(arr[i]);
            if(parseInt(arr[i].amount) > maxAmount){
                maxAmount=parseInt(arr[i].amount);
                maxAmountCategory=arr[i].category;
            }
        }
        else if(arr[i].category==="Transportation" && currentMonth==monthIndex){
            monthlyChartArray[3]+=parseInt(arr[i].amount);
            tableArray.push(arr[i]);
            if(parseInt(arr[i].amount) > maxAmount){
                maxAmount=parseInt(arr[i].amount);
                maxAmountCategory=arr[i].category;
            }
        }
        else if(arr[i].category==="Entertainment" && currentMonth==monthIndex){
            monthlyChartArray[4]+=parseInt(arr[i].amount);
            tableArray.push(arr[i]);
            if(parseInt(arr[i].amount) > maxAmount){
                maxAmount=parseInt(arr[i].amount);
                maxAmountCategory=arr[i].category;
            }
        }
        barChartArray[monthIndex]+= parseInt(arr[i].amount);
    }
    tableArray= tableArray.reverse();
    if(tableArray.length>5){
        tableArray=tableArray.slice(0,5);
    }

    monthlyChartArray.forEach(e=>{
        totalAmount+=e;
    })
    const object={
        monthlyChartArrayKey: monthlyChartArray,
        barChartArrayKey: barChartArray,
        totalAmountKey:totalAmount,
        maxAmountKey:maxAmount,
        maxAmountCategoryKey: maxAmountCategory
    }
    updatePieChart(object.monthlyChartArrayKey) ;
    updateBarChart(object.barChartArrayKey);
    updateTotalMonthlyExpenses(object.totalAmountKey);
    updateMaxAmount(object.maxAmountKey,object.maxAmountCategoryKey);
    updateTable(tableArray);
    progressBar(totalAmount);
}

const expenseForm = document.getElementById("expense-form");
expenseForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const inputData= new FormData(e.target);
    const data=Object.fromEntries(inputData.entries());
    const existingEntries = JSON.parse(localStorage.getItem("allExpenses")) || [];
    existingEntries.push(data);
    localStorage.setItem("allExpenses", JSON.stringify(existingEntries));
    e.target.reset()
    calculateAmount();
})


