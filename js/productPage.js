let mainBoxTitleContainer=$.querySelector(".main-box-title-container");
let selectProductPages=$.querySelector(".select-product-pages");
let productsPageWrapper=$.querySelector(".products-page-wrapper");
let openFilterBtn=$.querySelector(".open-filter-btn");
let filterContainer=$.querySelector(".filter-container");
let filterItemIcon=$.querySelector(".filter-item-icon");
let filterColorCircle=$.querySelectorAll(".filter-color-circle");
let categoryCheckbox=$.querySelectorAll(".category-checkbox");
let sortCheckbox=$.querySelectorAll(".sort-checkbox");
let isAvailableCheckbox=$.querySelector(".isAvailable-checkbox");
let allFilterCheckbox=$.querySelectorAll(".filter-checkbox");
let filterSubmit=$.querySelector(".filter-submit");
let filterClear=$.querySelector(".filter-clear");
let categoryFilterArray=[]
let sortFilterArray=[]
let colorFilterArray=[]
let isAvailableCheckboxBool=null
let afterFilterArray=[]

let productsTempArray=[]
let allProductCount=null
let paginationCount=null
let productInOnePageCount=12

function productPageFetch(searchInDbBy,fillProductPageBy,productPageTitle){
    fetch( "https://api.backendless.com/E00D2420-4B94-448F-91C9-CD735A45C196/2360764B-B7DE-46FA-B8FB-8DEEF590B988/data/products?pagesize=100"
    )
    .then((res) => {
        return res.json();
        })
        .then((data) => {
            productsPageWrapper.innerHTML=""

            data.forEach((product) => {
                if(typeof(product[searchInDbBy])=="object" && product[searchInDbBy]!=null){
                    product[searchInDbBy].forEach((item)=>{
                        if(item==fillProductPageBy){
                            productsTempArray.push(product)
                        }
                    })
                }else{ 
                    if(product[searchInDbBy]==fillProductPageBy){
                        productsTempArray.push(product)
                    }
                }
            })
            productPageTitleInsert(mainBoxTitleContainer,productPageTitle)

            allProductCount=productsTempArray.length
            paginationCount=Math.ceil((allProductCount/productInOnePageCount))
            for (let j = 0; j < paginationCount; j++) {
                productSizeBoxMaker(selectProductPages,String(j+1))
            }
            let productPageBox=$.querySelectorAll(".product-page")
            productPageBox.forEach(sizeBox=>{
                if(!(sizeBox.innerHTML==location.hash.slice(1))){
                    sizeBox.classList.remove("product-page-active")
                }else{
                    sizeBox.classList.add("product-page-active")
                }

            })

            afterFilterArray=productsTempArray
            productPageInsertByPagination(location.hash.slice(1),productInOnePageCount,afterFilterArray,productsPageWrapper)
            let productNameArray = $.querySelectorAll(".product-name");
            isProductInWishlist(productNameArray)
            preLoaderDisappear()  
        })
    }
function productPageOnclickEvent(e){
    for (let sizeBox of e.target.parentElement.children) {
        if(sizeBox.className.includes("product-page-active")){
            sizeBox.classList.remove("product-page-active")
        } 
    }
    e.target.classList.add("product-page-active")
    location.href=`${(location.href).split("#")[0]}#${e.target.innerHTML}`
    productsPageWrapper.innerHTML=""
    productPageInsertByPagination((e.target.innerHTML),productInOnePageCount,afterFilterArray,productsPageWrapper)
    let productNameArray = $.querySelectorAll(".product-name");
    isProductInWishlist(productNameArray)

}





openFilterBtn.addEventListener("click",()=>{
    filterContainer.style.right="10px"
})
filterItemIcon.addEventListener("click",()=>{
    filterContainer.style.right="-5000px"
})


filterColorCircle.forEach((circle)=>{
    circle.addEventListener("click",()=>{
        circle.classList.toggle("product-page-active")
    })
})

filterSubmit.addEventListener("click",(e)=>{
    productsPageWrapper.innerHTML=""
    selectProductPages.innerHTML=""
    categoryFilterArray=[]
    sortFilterArray=[]
    colorFilterArray=[]
    afterFilterArray=[]

    categoryCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            categoryFilterArray.push(checkbox.nextElementSibling.innerHTML)
        }
    })   
    sortCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            sortFilterArray.push(checkbox.nextElementSibling.innerHTML)
        }
    })   
    filterColorCircle.forEach((colorCircle)=>{
        if(colorCircle.className.includes("product-page-active")){
            colorFilterArray.push(colorCircle.nextElementSibling.innerHTML)
        }
    })
    if(isAvailableCheckbox.checked){
        isAvailableCheckboxBool=true
    }else{
        isAvailableCheckboxBool=false
    }   
    productsTempArray.forEach((product)=>{
        submitFilters(product,afterFilterArray,categoryFilterArray,colorFilterArray,isAvailableCheckboxBool)
    })

      
    if(sortFilterArray[0]=="ارزان‌ترین" || sortFilterArray[0]=="گران‌ترین"){
        let j=0
        while (j<(afterFilterArray.length)-1) {
            let temp
            let i=0
            while(i<(afterFilterArray.length)-1){
                if(((afterFilterArray[i].price)[1] || (afterFilterArray[i].price)[0]) > ((afterFilterArray[i+1].price)[1] || (afterFilterArray[i+1].price)[0])){
                    temp=afterFilterArray[i]
                    afterFilterArray[i]=afterFilterArray[i+1]
                    afterFilterArray[i+1]=temp
    
                }
                i++
            }
        j++
        }
        if(sortFilterArray[0]=="گران‌ترین"){
            afterFilterArray.reverse()
        }
    }else if(sortFilterArray[0]=="جدیدترین"){
        let j=0
        while (j<(afterFilterArray.length)-1) {
            let temp
            let i=0
            while(i<(afterFilterArray.length)-1){
                if(afterFilterArray[i].created < afterFilterArray[i+1].created ){
                    temp=afterFilterArray[i]
                    afterFilterArray[i]=afterFilterArray[i+1]
                    afterFilterArray[i+1]=temp
    
                }
                i++
            }
        j++
        }
    }

    allProductCount=afterFilterArray.length
    paginationCount=Math.ceil((allProductCount/productInOnePageCount))
    for (let j = 0; j < paginationCount; j++) {
        productSizeBoxMaker(selectProductPages,String(j+1))
    }
    productPageInsertByPagination(1,productInOnePageCount,afterFilterArray,productsPageWrapper)
    let productNameArray = $.querySelectorAll(".product-name");
    isProductInWishlist(productNameArray)
    location.href=`${(location.href).split("#")[0]}#1`
    let productPageBox=$.querySelectorAll(".product-page")
            productPageBox.forEach(sizeBox=>{
                if(!(sizeBox.innerHTML==location.hash.slice(1))){
                    sizeBox.classList.remove("product-page-active")
                }else{
                    sizeBox.classList.add("product-page-active")
                }

            })

    filterContainer.style.right="-500px"
})
filterClear.addEventListener("click",e=>{
    allFilterCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkbox.checked=false
        }
    })  
    filterColorCircle.forEach((colorCircle)=>{
        if(colorCircle.className.includes("product-page-active")){
            colorCircle.classList.remove("product-page-active")
        }
    })  
})



let locationSearchParams=new URLSearchParams(location.search)
productPageFetch(locationSearchParams.get("k1"),locationSearchParams.get("k2"),locationSearchParams.get("k3"))
let productPageAudio=$.querySelector(".product-page-audio");
    window.addEventListener("scroll",()=>{
        if(locationSearchParams.get("k3")=="CURB X CHVRSI"){
        productPageAudio.play()
}  
    },{once:true}
        )
        