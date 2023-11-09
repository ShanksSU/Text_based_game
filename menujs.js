const imgListOne = document.querySelector('.img-list')
let imgBoxList = Array.prototype.slice.call(document.querySelectorAll('.img-list .img-box'))
const imgBoxCount = imgBoxList.length
const root = document.documentElement;
const btnGroup = document.querySelector('.btn-group')
const lastBtn = document.querySelector('.last')
const nextBtn = document.querySelector('.next')
const lastImgBox = document.getElementById('last-img-box')

const postSpacing = Number(getComputedStyle(root).getPropertyValue('--post-spacing').replace("vw", ""));
const postSize = Number(getComputedStyle(root).getPropertyValue('--post-size').replace("vw", ""));

let imgListLength = (postSize + postSpacing) * imgBoxCount
const imgBoxLength = postSize + postSpacing

let index = 0
let indexOne = 1
let timer = null
let animationTime = 0.5

imgBoxList.unshift(imgBoxList.pop())
imgListOne.style.transition = animationTime + 's ease'
setTimeout(function () {
    btnGroup.style.opacity = '1'
    btnGroup.style.bottom = '5%'
}, animationTime * 1000)

function cilckFun(flag) {
    if (flag == 'next') {
        index--
        imgListOne.style.left = imgBoxLength * index + "vw";
        setTimeout(function () {
            imgListOne.style.transition = 'none'
            if (Math.abs(index) == imgBoxCount) {
                index = 0
                imgListOne.style.left = 0
                imgBoxList.forEach(item => {
                    if (item.id == 'last-img-box') {
                        item.style.transform = `translateX(-160.68vw)`
                    } else {
                        item.style.transform = 'none'
                    }
                });
            } else {
                if (imgBoxList[0].id == 'last-img-box') {
                    lastImgBox.style.transition = 'none'
                    lastImgBox.style.transform = 'translateX(0px)'
                } else if (index >= 0) {
                    imgBoxList[0].style.transform = 'none'
                } else {
                    imgBoxList[0].style.transform = 'translateX(160.68vw)'
                }
            }
            imgBoxList.push(imgBoxList.shift())
        }, animationTime * 1000)
    } else {
        index++
        imgBoxList.unshift(imgBoxList.pop())
        if (imgBoxList[0].id == 'last-img-box' && index != 0) {
            imgBoxList[0].style.transform = 'translateX(-321.36vw)'
        } else if (index < 0) {
            imgBoxList[0].style.transform = 'none'
        } else {
            imgBoxList[0].style.transform = 'translateX(-160.68vw)'
        }
        imgListOne.style.left = imgBoxLength * index + "vw";
        lastImgBox.style.transition = 'none'
        if (Math.abs(index) == imgBoxCount) {
            index = 0
            setTimeout(function () {
                imgListOne.style.transition = 'none'
                imgListOne.style.left = 0
                imgBoxList.forEach(item => {
                    if (item.id == 'last-img-box') {
                        item.style.transform = 'translateX(-160.68vw)'
                    } else {
                        item.style.transform = 'none'
                    }
                });
            }, animationTime * 1000)
        }
    }
    imgListOne.style.transition = animationTime + 's ease'
}

function throttle(fn, delay) {
    return function () {
        if (timer) {
            return
        }
        fn.apply(this, arguments)
        timer = setTimeout(() => {
            timer = null
        }, delay)
    }
}
nextBtn.onclick = throttle(() => cilckFun('next'), animationTime * 1000);
lastBtn.onclick = throttle(() => cilckFun('last'), animationTime * 1000);