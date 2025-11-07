import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildNumerologyProfile } from "@/lib/numerology";
import { generateDocx, generatePdf } from "@/lib/exporters";
import { sendReportEmail } from "@/lib/mailer";

export const runtime = "nodejs";

const requestSchema = z.object({
  fullName: z.string().min(3).max(100),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload = requestSchema.parse(body);

    const profile = buildNumerologyProfile(payload.fullName, payload.birthDate);

    const [user, docxBuffer, pdfBytes] = await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          fullName: payload.fullName,
          birthDate: new Date(payload.birthDate),
        },
      }),
      generateDocx(profile),
      generatePdf(profile),
    ]);

    const pdfBuffer = Buffer.from(pdfBytes);

    await prisma.report.create({
      data: {
        userId: user.id,
        fullName: profile.fullName,
        birthDate: new Date(payload.birthDate),
        lifePathNumber: profile.lifePathNumber,
        destinyNumber: profile.destinyNumber,
        soulUrgeNumber: profile.soulUrgeNumber,
        personalityNumber: profile.personalityNumber,
        maturityNumber: profile.maturityNumber,
        karmicDebtNumbers: profile.karmicDebtNumbers,
        summary: profile.sections.map((section) => `${section.title}: ${section.content}`).join(" "),
      },
    });

    await sendReportEmail({
      to: session.user.email,
      subject: `Báo cáo Thần Số Học - ${profile.fullName}`,
      html: buildEmailTemplate(profile),
      pdfBuffer,
    });

    return NextResponse.json({
      profile,
      files: {
        docx: docxBuffer.toString("base64"),
        pdf: pdfBuffer.toString("base64"),
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Không thể tạo báo cáo, vui lòng thử lại." }, { status: 500 });
  }
}

function buildEmailTemplate(profile: Awaited<ReturnType<typeof buildNumerologyProfile>>) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <h1 style="color: #4f46e5;">Báo cáo Thần Số Học cá nhân</h1>
      <p>Xin chào ${profile.fullName},</p>
      <p>Đính kèm là báo cáo thần số học ấn bản PDF dành riêng cho bạn.</p>
      <p><strong>Ngày sinh:</strong> ${profile.formattedBirthDate}</p>
      <p><strong>Chỉ số chính:</strong></p>
      <ul>
        <li>Đường đời: ${profile.lifePathNumber}</li>
        <li>Sứ mệnh: ${profile.destinyNumber}</li>
        <li>Linh hồn: ${profile.soulUrgeNumber}</li>
        <li>Nhân cách: ${profile.personalityNumber}</li>
        <li>Trưởng thành: ${profile.maturityNumber}</li>
      </ul>
      <p>Hãy dành thời gian chiêm nghiệm từng chỉ số để thấu hiểu bản thân sâu sắc hơn.</p>
      <p>Thân ái,<br/>${process.env.NEXT_PUBLIC_APP_NAME ?? "Thần Số Học Pro"}</p>
    </div>
  `;
}
