import { useReducedMotion } from 'motion/react'
import { TypingText, TypingTextCursor } from './TypingText'
import './TypingHeading.css'

type TypingHeadingProps = Readonly<{
  text: string
}>

export function TypingHeading({ text }: TypingHeadingProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <span className="typing-heading" aria-hidden="true">
      <span className="typing-heading__layout-copy">{text}</span>
      {prefersReducedMotion ? (
        <span className="typing-heading__static">{text}</span>
      ) : (
        <TypingText
          className="typing-heading__animated"
          text={text}
          duration={100}
          delay={0}
          inView
          inViewOnce
          loop={false}
        >
          <TypingTextCursor
            className="typing-heading__cursor"
            style={{
              height: '0.78em',
              marginLeft: '0.055em',
              transform: 'translateY(0.06em)',
              width: '0.035em',
            }}
          />
        </TypingText>
      )}
    </span>
  )
}
