import siteConfig from '~/site.config'
import { Resvg } from '@resvg/resvg-js'
import type { APIRoute } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import { resolveThemeColorStyles } from '~/utils'
import path from 'path'
import fs from 'fs'
import type { ReactNode } from 'react'

// Load the font file as binary data
const fontPath = path.resolve(
  './node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf',
)
const fontData = fs.readFileSync(fontPath)

const avatarPath = path.resolve(siteConfig.socialCardAvatarImage)
let avatarBase64: string | undefined
if (
  fs.existsSync(avatarPath) &&
  (path.extname(avatarPath).toLowerCase() === '.jpg' ||
    path.extname(avatarPath).toLowerCase() === '.jpeg')
) {
  const avatarData = fs.readFileSync(avatarPath)
  avatarBase64 = `data:image/jpeg;base64,${avatarData.toString('base64')}`
}

const defaultTheme =
  siteConfig.themes.default === 'auto'
    ? siteConfig.themes.include[0]
    : siteConfig.themes.default

const themeStyles = await resolveThemeColorStyles(
  [defaultTheme],
  siteConfig.themes.overrides,
)
const bg = themeStyles[defaultTheme]?.background
const fg = themeStyles[defaultTheme]?.foreground
const accent = themeStyles[defaultTheme]?.accent

if (!bg || !fg || !accent) {
  throw new Error(`Theme ${defaultTheme} does not have required colors`)
}

const ogOptions: SatoriOptions = {
  fonts: [
    {
      data: fontData,
      name: 'JetBrains Mono',
      style: 'normal',
      weight: 400,
    },
  ],
  height: 630,
  width: 1200,
}

const markup = html(`<div tw="flex flex-col max-w-full justify-center h-full bg-[${bg}] text-[${fg}] p-12">
  <div style="border-width: 12px; border-radius: 80px;" tw="flex items-center max-w-full p-8 border-[${accent}]/30">
    ${
      avatarBase64
        ? `<div tw="flex flex-col justify-center items-center w-1/3 h-100">
          <img src="${avatarBase64}" tw="flex w-full rounded-full border-[${accent}]/30" />
      </div>`
        : ''
    }
    <div tw="flex flex-1 flex-col max-w-full justify-center items-center">
      <h1 tw="text-6xl my-14 text-center leading-snug">${siteConfig.title}</h1>
      <p tw="text-4xl text-[${accent}]">${siteConfig.author}</p>
    </div>
  </div>
</div>`)

export const GET: APIRoute = async () => {
  const svg = await satori(markup as ReactNode, ogOptions)
  const png = new Resvg(svg).render().asPng()
  return new Response(png, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/png',
    },
  })
}
