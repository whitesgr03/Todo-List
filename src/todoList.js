'use strict'

// From layouts folder
import { createSidebar } from './layouts';

function createTodoList() {

    const init = () => {
        const sidebar = createSidebar();

        sidebar.init()
        // sidebar.createPages('Inbox')

        // createMain()

        document.addEventListener('pointerdown', showOption);
    }

    function showOption(e) {
        const target = e.target.closest('.option')

        if (!target) return
        
        target.classList.toggle('active');
        
        if (!target.classList.contains('active')) return 

        const optionCoord = target.getBoundingClientRect()

        const optionList = target.querySelector('.optionList');
        optionList.style.top = `${optionCoord.bottom + 10}px`;
        optionList.style.left = `${optionCoord.left - (optionList.clientWidth - optionCoord.width) / 2}px`;
        
        this.addEventListener('pointerdown', closeOptionListWithClick)
        this.addEventListener('scroll', closeOptionListWithScroll, {
            capture: true,
            once: true
        })

            function closeOptionListWithClick(e) {
            
            const secondTarget = e.target.closest('.option')
                
                if (!secondTarget || secondTarget !== target) {
                target.classList.remove('active');
            }
            this.removeEventListener('pointerdown', closeOptionListWithClick)
        }
        function closeOptionListWithScroll() {
            target.classList.remove('active');
        }
    }

    return {
        init,
    }
    

}


export {
    createTodoList,
}