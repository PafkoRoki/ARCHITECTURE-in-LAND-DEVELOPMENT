/*
 * Adapted from Animate UI's Typing Text primitive by Skyleen.
 * Source: https://github.com/imskyleen/animate-ui
 * License: MIT
 */
import * as React from 'react'
import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import { useIsInView } from '../hooks/useIsInView'
import type { UseIsInViewOptions } from '../hooks/useIsInView'
import { getStrictContext } from '../lib/getStrictContext'

type TypingTextContextType = {
  isTyping: boolean
  setIsTyping: (isTyping: boolean) => void
}

const [TypingTextProvider, useTypingText] =
  getStrictContext<TypingTextContextType>('TypingTextContext')

export type TypingTextProps = React.ComponentProps<'span'> &
  Readonly<{
    duration?: number
    delay?: number
    loop?: boolean
    holdDelay?: number
    text: string | string[]
  }> &
  UseIsInViewOptions

export function TypingText({
  ref,
  children,
  duration = 100,
  delay = 0,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  loop = false,
  holdDelay = 1000,
  text,
  ...props
}: TypingTextProps) {
  const { ref: localRef, isInView } = useIsInView(
    ref as React.Ref<HTMLElement>,
    {
      inView,
      inViewOnce,
      inViewMargin,
    },
  )
  const [isTyping, setIsTyping] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [displayedText, setDisplayedText] = React.useState('')

  React.useEffect(() => {
    if (!isInView) return

    const timeoutId = window.setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [delay, isInView])

  React.useEffect(() => {
    if (!started) return

    const timeoutIds: number[] = []
    const texts = typeof text === 'string' ? [text] : text

    const schedule = (callback: () => void, timeout: number) => {
      const timeoutId = window.setTimeout(callback, timeout)
      timeoutIds.push(timeoutId)
    }

    const typeText = (value: string, onComplete: () => void) => {
      setIsTyping(true)
      let currentIndex = 0

      const type = () => {
        if (currentIndex <= value.length) {
          setDisplayedText(value.substring(0, currentIndex))
          currentIndex += 1
          schedule(type, duration)
          return
        }

        setIsTyping(false)
        onComplete()
      }

      type()
    }

    const eraseText = (value: string, onComplete: () => void) => {
      setIsTyping(true)
      let currentIndex = value.length

      const erase = () => {
        if (currentIndex >= 0) {
          setDisplayedText(value.substring(0, currentIndex))
          currentIndex -= 1
          schedule(erase, duration)
          return
        }

        setIsTyping(false)
        onComplete()
      }

      erase()
    }

    const animateTexts = (index: number) => {
      const value = texts[index] ?? ''

      typeText(value, () => {
        const isLast = index === texts.length - 1

        if (isLast && !loop) return

        schedule(() => {
          eraseText(value, () => {
            animateTexts(isLast ? 0 : index + 1)
          })
        }, holdDelay)
      })
    }

    animateTexts(0)

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [duration, holdDelay, loop, started, text])

  return (
    <TypingTextProvider value={{ isTyping, setIsTyping }}>
      <span ref={localRef} data-slot="typing-text" {...props}>
        <motion.span>{displayedText}</motion.span>
        {children}
      </span>
    </TypingTextProvider>
  )
}

export type TypingTextCursorProps = Omit<
  HTMLMotionProps<'span'>,
  'children'
>

export function TypingTextCursor({
  style,
  variants,
  ...props
}: TypingTextCursorProps) {
  const { isTyping } = useTypingText()

  return (
    <motion.span
      data-slot="typing-text-cursor"
      aria-hidden="true"
      variants={{
        blinking: {
          opacity: [0, 0, 1, 1],
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'linear',
            times: [0, 0.5, 0.5, 1],
          },
        },
        visible: { opacity: 1 },
        ...variants,
      }}
      animate={isTyping ? 'visible' : 'blinking'}
      style={{
        display: 'inline-block',
        height: '16px',
        transform: 'translateY(2px)',
        width: '1px',
        backgroundColor: 'currentColor',
        ...style,
      }}
      {...props}
    />
  )
}
