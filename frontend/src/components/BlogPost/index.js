import React from "react"
import * as S from "./styled"

export default function BlogPost({ title, date, formattedDate, content, timeToRead, tags, image }) {
  return (
    <S.Article>
      <header>
        <h1>{title}</h1>
        <p>
          <time dateTime={date}>{formattedDate}</time> • {timeToRead} minute read
        </p>
      </header>
      <section dangerouslySetInnerHTML={{ __html: content }} />
    </S.Article>
  )
}
