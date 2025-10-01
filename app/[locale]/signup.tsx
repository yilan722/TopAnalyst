'use client'

import React from 'react'
import SignupPage from '../../components/SignupPage'
import { type Locale } from '../services/i18n'

interface SignupPageProps {
  params: { locale: Locale }
}

export default function Signup({ params }: SignupPageProps) {
  return <SignupPage locale={params.locale} />
}
