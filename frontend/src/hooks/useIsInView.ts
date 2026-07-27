import * as React from 'react'
import { useInView } from 'motion/react'
import type { UseInViewOptions } from 'motion/react'

export type UseIsInViewOptions = Readonly<{
  inView?: boolean
  inViewOnce?: boolean
  inViewMargin?: UseInViewOptions['margin']
}>

export function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T> | undefined,
  options: UseIsInViewOptions = {},
) {
  const {
    inView,
    inViewOnce = false,
    inViewMargin = '0px',
  } = options
  const localRef = React.useRef<T>(null)

  React.useImperativeHandle(ref, () => localRef.current as T)

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  })

  return {
    ref: localRef,
    isInView: !inView || inViewResult,
  }
}
