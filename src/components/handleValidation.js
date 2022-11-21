'use strict'

// library
import { isToday } from 'date-fns';


const handleValidation = (() => {
    
    const validFormData = (formProps, form) => {
    let isValid = true;

    for (let field in formProps) {
        const elem = form.elements[field]

        if (elem.dataset.skipValid && elem.classList.contains('disableOutline')) {
            continue
        }

        if (!elem.classList.contains('disableOutline')) {
            isValid = false;
            elem.focus();
            return
        }

        const value = formProps[field].trim();

        if (value.length === 0) {
            const elem = form.elements[field]
        
            isValid = false;
            elem.focus();
            elem.classList.remove('disableOutline')

            elem.addEventListener('blur', disableOutLine)

            return isValid
        }
    }
        return isValid
    }
    const validDate = (e) => {

        const form = e.target.closest('form');
        form.elements.time.value = '';  // 每次選日期時清除時間

        const message = form.querySelector('.message')
        const inputState = e.target.validity; // Constraint validation
    
        if (e.target.value.length === 0 || inputState.valueMissing) { // 點選或鍵盤刪除值時
            e.target.value = '';
            message.textContent = 'Time is optional';
            message.className = 'message';
            message.hidden = false;

            e.target.classList.add('disableOutline')
            return
        }

        // 這邊開始是一定有選擇值
        let day = new Date(e.target.value);
        let currentTime = new Date().setHours(0, 0, 0, 0)

        if (day < currentTime) {  // 如果日期是今天之前
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;

            e.target.classList.remove('disableOutline')
            e.target.focus();
        } else {   // 如果日期是今天之後
            message.hidden = true;
            e.target.classList.add('disableOutline')
        }
    }
    const validTime = (e) => {
    
        const form = e.target.closest('form');
        const message = form.querySelector('.message')
        const inputState = e.target.validity; // Constraint validation

        let day = form.elements.day;
    
        if (inputState.valueMissing || e.target.value.length === 0) { // 有選過之後又刪除值時
            e.target.value = '';
            e.target.classList.add('disableOutline')
            return
        }


        if (!day.value) {  // 未設定日期時會不給設定
            day.focus()
            e.target.value = '';
            message.textContent = 'Date must be set'
            message.classList.add('error');
            message.hidden = false;
            return;
        }
        

        if (!day.classList.contains('disableOutline')) {  // 未設定日期時會不給設定
            day.focus()
            e.target.value = '';
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;
            return;
        }


        // 這邊開始是一定有選日期並且大於今日

        if (!isToday(new Date(day.value))) return // 如果選擇的日期不是今天, 那就是未來時不需驗證


        // 如果選擇的日期是今天時, 必須驗證日期 + 時間是否有大於現在的時間
        const inputDate = new Date(`${day.value}T${e.target.value}`);
        const currentTime = new Date().setSeconds(0, 0)
        
        if (inputDate < currentTime) { // 小於目前時間顯示
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;

            e.target.classList.remove('disableOutline')
            e.target.focus();
            return
        } else { // 大於目前時
            message.hidden = true;
            e.target.classList.add('disableOutline')
        }
    }

    function disableOutLine() {
        this.classList.add('disableOutline')
        this.removeEventListener('blur', disableOutLine)
    }

    return {
        validFormData,
        validDate,
        validTime
    }
})()

export {
    handleValidation,
}
