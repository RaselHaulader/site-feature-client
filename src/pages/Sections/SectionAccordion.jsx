import React from 'react'

export default function SectionAccordion({section}) {
  return (
    <div>
      <h2>{section.name}</h2>
      <h3>{section.key}</h3>
      {/* <div dangerouslySetInnerHTML={{__html: section.details}} /> */}
    </div>
  )
}
