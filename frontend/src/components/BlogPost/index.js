import React from "react"
import * as S from "./styled"

export default function BlogPost({ title, date, formattedDate, content }) {
  return (
    <S.Article>
      <header>
        <h1>{title}</h1>
        <time dateTime={date}>{formattedDate}</time>
      </header>
      <section dangerouslySetInnerHTML={{ __html: content }} />
    </S.Article>
  )
}
