import { NextRequest, NextResponse } from 'next/server';

const TEMPLATES = ['sky', 'dunes', 'palms', 'geometric', 'light'];

function buildCardSVG(params: {
  lessonText: string;
  sourceBook: string;
  grade: string;
  template: string;
  size: '1080x1920' | '1080x1080';
}): string {
  const { lessonText, sourceBook, grade, template, size } = params;
  const [width, height] = size === '1080x1920' ? [1080, 1920] : [1080, 1080];

  // ألوان الخلفية حسب القالب
  const gradients: Record<string, string> = {
    sky: 'url(#skyGrad)',
    dunes: 'url(#dunesGrad)',
    palms: 'url(#palmsGrad)',
    geometric: 'url(#geoGrad)',
    light: 'url(#lightGrad)',
  };

  const bg = gradients[template] || gradients.sky;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- تدرجات الخلفية -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2f4a"/>
      <stop offset="100%" stop-color="#3F5233"/>
    </linearGradient>
    <linearGradient id="dunesGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a3728"/>
      <stop offset="100%" stop-color="#8B6914"/>
    </linearGradient>
    <linearGradient id="palmsGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a3a2a"/>
      <stop offset="100%" stop-color="#2d5a3d"/>
    </linearGradient>
    <linearGradient id="geoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22301B"/>
      <stop offset="100%" stop-color="#3F5233"/>
    </linearGradient>
    <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F6F1E3"/>
      <stop offset="100%" stop-color="#EDE5CF"/>
    </linearGradient>
    <!-- توهج نور النبي ﷺ (نور مشرق فقط، لا شكل بشري) -->
    <radialGradient id="prophetGlow" cx="50%" cy="35%" r="30%">
      <stop offset="0%" stop-color="#FFE082" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#B89B5E" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- خلفية -->
  <rect width="${width}" height="${height}" fill="${bg}"/>

  <!-- نور مشرق (رمز النبي ﷺ — لا شكل بشري) -->
  <ellipse cx="${width / 2}" cy="${height * 0.32}" rx="320" ry="200" fill="url(#prophetGlow)" opacity="0.7"/>

  <!-- زخرفة هندسية إسلامية خفيفة -->
  <g opacity="0.07" fill="none" stroke="#B89B5E" stroke-width="1.5">
    <rect x="80" y="80" width="${width - 160}" height="${height - 160}" rx="8"/>
    <rect x="96" y="96" width="${width - 192}" height="${height - 192}" rx="4"/>
  </g>

  <!-- إطار النص -->
  <rect x="80" y="${height * 0.4}" width="${width - 160}" height="${height * 0.45}" rx="16"
        fill="#22301B" fill-opacity="0.6"/>

  <!-- نص العبرة (Amiri) -->
  <text
    x="${width / 2}"
    y="${height * 0.52}"
    text-anchor="middle"
    font-family="Amiri, serif"
    font-size="${height === 1920 ? 52 : 44}"
    fill="#F6F1E3"
    direction="rtl"
  >${escapeXml(lessonText.substring(0, 100))}</text>

  <!-- المصدر والدرجة -->
  <text
    x="${width / 2}"
    y="${height * 0.72}"
    text-anchor="middle"
    font-family="IBM Plex Sans Arabic, sans-serif"
    font-size="28"
    fill="#B89B5E"
    direction="rtl"
  >${escapeXml(sourceBook)} | الدرجة: ${escapeXml(grade)}</text>

  <!-- شعار «أسوة» -->
  <text
    x="${width / 2}"
    y="${height - 80}"
    text-anchor="middle"
    font-family="Aref Ruqaa, serif"
    font-size="48"
    fill="#B89B5E"
    letter-spacing="4"
  >أسوة</text>
</svg>`;
}

function escapeXml(str: string): string {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonText = searchParams.get('lesson') || '';
    const sourceBook = searchParams.get('book') || '';
    const grade = searchParams.get('grade') || '';
    const template = TEMPLATES.includes(searchParams.get('template') || '') 
      ? searchParams.get('template')! 
      : 'sky';
    const size = searchParams.get('size') === '1080x1080' ? '1080x1080' : '1080x1920';
    const format = searchParams.get('format') || 'svg';

    const svg = buildCardSVG({ lessonText, sourceBook, grade, template, size });

    if (format === 'svg') {
      return new NextResponse(svg, {
        headers: { 'Content-Type': 'image/svg+xml' },
      });
    }

    // تحويل SVG إلى PNG
    try {
      const { Resvg } = await import('@resvg/resvg-js');
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: size === '1080x1920' ? 1080 : 1080 },
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="aswa-card.png"`,
        },
      });
    } catch {
      // Fallback: return SVG if resvg fails
      return new NextResponse(svg, {
        headers: { 'Content-Type': 'image/svg+xml' },
      });
    }
  } catch (error) {
    console.error('Card API error:', error);
    return NextResponse.json({ error: 'فشل توليد البطاقة' }, { status: 500 });
  }
}
