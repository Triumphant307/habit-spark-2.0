"use client"
import { MouseEvent }  from "react"
import styles from '../Styles/ripple.module.css'

const Ripple: React.FC<React.PropsWithChildren> = ({ children}) => {
    const createRipple = (event: MouseEvent<HTMLElement>) => {
        const target = event.currentTarget
        const circle = document.createElement("span")
        const diameter = Math.max(target.clientWidth, target.clientHeight)
        const radius = diameter / 2

        circle.style.width = circle.style.height = `${diameter}px`
        circle.style.left = `${event.clientX - target.getBoundingClientRect().left - radius}px`
        circle.style.top = `${event.clientY - target.getBoundingClientRect().top - radius}px`
        circle.classList.add(styles.ripple)

        const ripple = target.getElementsByClassName(styles.ripple)[0]
        if (ripple) ripple.remove()

            target.appendChild(circle)
    }

    return (
        <div className={styles.rippleContainer} onPointerDown={createRipple}>
            {children}
        </div>
    )
}

export default Ripple