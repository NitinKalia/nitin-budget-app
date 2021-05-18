var budgetController = (function(){
    var Expense= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome){
        //console.log(totalIncome)
        if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100)
    }   
    else{
        this.percentage=-1;
    }
    };
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    }
    var Income= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calculateTotal=function(type){
        var sum =0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        })
        data.totals[type]=sum;
    }
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }
    return{
        addItem:function(type, desc,val){
            var newItem,ID;
            //create a new ID
            if(data.allItems[type].length>0){
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                ID=0
            }
           
            //create newItem based on exp or inc
            if(type==='exp'){
                newItem= new Expense(ID,desc,val)
            }
            else if(type==='inc'){
                newItem= new Income(ID,desc,val)
            }
            //pushItem
            data.allItems[type].push(newItem);

            //return new element
            return newItem;
        },
        deleteItem:function(type,id){
            var ids,index;
            ids=data.allItems[type].map(function(current){
                return current.id;
            });     
            
            index=ids.indexOf(id);
             if(index!== -1){
                 data.allItems[type].splice(index,1);
             }
        },
        calculateItems:function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget= data.totals.inc -data.totals.exp;
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }
           
        },
        calculatePercentages:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);

            })
        },
        getPercentages:function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            //console.log(allPerc)
            return allPerc;

        },
        
        getBudget:function(){
            return{
                budget:data.budget,
                totalIncome:data.totals.inc,
                totalExpenses:data.totals.exp,
                percentage:data.percentage
            }
        },
        testing:function(){
            console.log(data)
        }
    }
   
})()

var uiController= (function(){
    var DOMstring={
        inputType:'.add__type',
        inputDesc:'.add__description',
        inputVal:'.add__value',
        btnAdd:'.add__btn',
        incomeList:'.income__list',
        expenseList:'.expenses__list',
        budgetVal:'.budget__value',
        incomeVal:'.budget__income--value',
        expensesVal:'.budget__expenses--value',
        percentageVal:'.budget__expenses--percentage',
        container:'.container',
        itemPercentage:'.item__percentage',
        dateLabel:'.budget__title--month'


    };
    var formatNumber= function(num,type){
        var numSplit,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);
        numSplit=num.split('.');
        int=numSplit[0];        
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        dec=numSplit[1];
        return (type==='exp'?'-':'+')+''+int+'.'+dec;

    }
    var nodeList = function(list,callback){
        for(var i=0; i<list.length; i++){
            callback(list[i],i);
            
        }
    }
    return{        
        getInput:function(){
            return{
            type : document.querySelector(DOMstring.inputType).value,
            desc:document.querySelector(DOMstring.inputDesc).value,
            value:parseFloat(document.querySelector(DOMstring.inputVal).value)
        }
    },
    addListItem:function(obj,type){
        var html, newHTMl;
        if(type==='inc'){
            element=DOMstring.incomeList;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        else if(type==='exp'){
            element=DOMstring.expenseList;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        newHTMl=html.replace('%id%',obj.id);
        newHTMl=newHTMl.replace('%description%',obj.description);
        newHTMl=newHTMl.replace('%value%',formatNumber(obj.value,type) );
       
        document.querySelector(element).insertAdjacentHTML('beforeend', newHTMl);

    },
    clearFileds:function(){
        var fields,fieldArr;
        fields= document.querySelectorAll(DOMstring.inputDesc +','+DOMstring.inputVal);
        fieldArr=Array.prototype.slice.call(fields);
        fieldArr.forEach(function(current, index, array){
            current.value=""
        });
        fieldArr[0].focus()
    },
    displayBudget:function(obj){
        var type;
        obj.budget>0?type='inc':type='exp';
        document.querySelector(DOMstring.budgetVal).textContent =formatNumber(obj.budget,type);
        document.querySelector(DOMstring.incomeVal).textContent =formatNumber(obj.totalIncome,'inc');
        document.querySelector(DOMstring.expensesVal).textContent =formatNumber(obj.totalExpenses,'exp');
        if(obj.percentage>0){
            document.querySelector(DOMstring.percentageVal).textContent =obj.percentage+'%';
        }
        else{
            document.querySelector(DOMstring.percentageVal).textContent ='---';
        }
        
    },
    deleteListItem:function(selectorID){
        var id = document.getElementById(selectorID);
        id.parentNode.removeChild(id);
    },
    displayPercentage:function(percentage){
     var fields=   document.querySelectorAll(DOMstring.itemPercentage);
    // console.log(fields)
    
     nodeList(fields,function(current,index){
         if(percentage[index]>0){
            current.textContent=percentage[index]+"%"
         }
         else{
            current.textContent="---"
         }
     })

    },
    displayMonth:function(){
        var now = new Date();
        var year= now.getFullYear();
        var month= ["January","February","March","April","May","June","July","August","September","October","November","December"];
        document.querySelector(DOMstring.dateLabel).textContent=month[now.getMonth()]+" "+year;

    },
    changeType:function(){
        var fields= document.querySelectorAll(
                    DOMstring.inputType + ','+
                    DOMstring.inputDesc+','+
                    DOMstring.inputVal);
        nodeList(fields, function(cur){
            cur.classList.toggle('red-focus');
        });
        document.querySelector(DOMstring.btnAdd).classList.toggle('red');

    },

    getDom:function(){
        return DOMstring;
     }
    }
    
})()

var controller = (function(bdgtCtrl,uiCtrl){
    var setupEventListner=function(){
        var DOM=uiCtrl.getDom();
        document.querySelector(DOM.btnAdd).addEventListener('click',itemCtrl)
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13){
            itemCtrl();
            }
        })
        document.querySelector(DOM.container).addEventListener('click',itemDel);
        document.querySelector(DOM.inputType).addEventListener('change',uiCtrl.changeType);
        
    };
    var updateCalcbudget = function(){
       bdgtCtrl.calculateItems();
       var budgetGet= bdgtCtrl.getBudget();
       uiCtrl.displayBudget(budgetGet);
       
    

     //  console.log(budgetGet);
    }
    var updatePercentage= function(){
        bdgtCtrl.calculatePercentages();
        var percentage = bdgtCtrl.getPercentages();
        //console.log(percentage);
        uiCtrl.displayPercentage(percentage);

    }
    
    var itemCtrl=function(){
        var input,newItemAdd,addUIelem;
        // 1. get the field input data
        input=uiCtrl.getInput();


        if(input.desc!=="" && input.value){
        // 2. Add the item to the budget controller
        newItemAdd= bdgtCtrl.addItem(input.type,input.desc,input.value);
        //console.log(newItemAdd)
        // 3. Add the item to the UI
       uiCtrl.addListItem(newItemAdd,input.type);
       //4 clear the fields 
       uiCtrl.clearFileds();
        // 5. Calculate the budget
        updateCalcbudget();
        updatePercentage();
        
    }
    }
    var itemDel = function(event){
        var itemStore,splitID, type,ID
       itemStore= event.target.parentNode.parentNode.parentNode.parentNode.id;
       //console.log(itemStore)
       if(itemStore){
        splitID=itemStore.split('-');
        type=splitID[0];
        ID=parseInt(splitID[1]);
        bdgtCtrl.deleteItem(type,ID);
        uiCtrl.deleteListItem(itemStore);
        updateCalcbudget();
        updatePercentage();

       }

    }
    return{
        init:function(){
            console.log("Application Started");
            uiCtrl.displayMonth();
            setupEventListner();
            uiCtrl.displayBudget({
             budget:0,
            totalIncome:0,
            totalExpenses:0,
            percentage:-1
            })
            
        }
    }
   
})(budgetController,uiController)
controller.init();
