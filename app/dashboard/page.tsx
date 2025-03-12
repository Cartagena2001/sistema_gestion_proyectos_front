"use client"
import React from 'react'
import { CharHome } from '../components/charts/Chart'
import TitlePage from '../components/TitlePage'

export const page = () => {
  return (
    <div>
       <TitlePage
          title="Dashboard"
          span="En esta sección, puedes ver los datos de tu empresa en gráficos."
        />
       <CharHome />
    </div>
  )
}

export default page