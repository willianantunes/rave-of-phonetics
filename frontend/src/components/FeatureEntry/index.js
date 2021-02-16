import { Typography } from "@material-ui/core"
import React from "react"
import * as S from "./styled"

export function FeatureEntry({ title, createdAt, added, updated, text }) {
  return (
    <S.CustomPaper>
      <S.WrapperTitle>
        <S.Title>{title}</S.Title>
      </S.WrapperTitle>
      <S.WrapperDetails>
        <S.WhenItWasAvailable>{createdAt}</S.WhenItWasAvailable>
        <Typography>{text}</Typography>
      </S.WrapperDetails>
      <S.WrapperQuantity>
        {added > 0 && <S.FeatureAdded label={`${added} added`} />}
        {updated > 0 && <S.FeatureUpdated label={`${updated} updated`} />}
      </S.WrapperQuantity>
    </S.CustomPaper>
  )
}
