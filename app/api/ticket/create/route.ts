import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { seat_no, name, email, subject, description } = await request.json();

    // Validate required fields
    if (!seat_no || !email) {
      return NextResponse.json(
        { error: "seat_no and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const freshdeskDomain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;

    if (!freshdeskDomain || !apiKey) {
      return NextResponse.json(
        { error: "Freshdesk configuration missing" },
        { status: 500 }
      );
    }

    const payload = {
      email,
      name: name || "",
      subject: subject || `Seat:${seat_no} - ${name || "Unknown"}`,
      description: `Seat No: ${seat_no}\n\n${description || ""}`,
      priority: 1,
      status: 2,
    };

    const auth = Buffer.from(`${apiKey}:X`).toString("base64");

    const response = await fetch(`https://${freshdeskDomain}/api/v2/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to create ticket" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ ticket_id: data.id });

    // Commented example for Zendesk integration
    /*
    // Zendesk API example (uncomment and modify as needed)
    // const zendeskDomain = process.env.ZENDESK_DOMAIN;
    // const zendeskEmail = process.env.ZENDESK_EMAIL;
    // const zendeskToken = process.env.ZENDESK_TOKEN;
    //
    // const zendeskPayload = {
    //   ticket: {
    //     subject: subject || `Seat:${seat_no} - ${name || "Unknown"}`,
    //     comment: {
    //       body: `Seat No: ${seat_no}\n\n${description || ""}`,
    //     },
    //     requester: {
    //       name: name || "",
    //       email: email,
    //     },
    //     priority: "normal", // or "low", "high", "urgent"
    //     status: "new", // or "open", "pending", "solved", "closed"
    //   },
    // };
    //
    // const zendeskAuth = Buffer.from(`${zendeskEmail}/token:${zendeskToken}`).toString("base64");
    //
    // const zendeskResponse = await fetch(`https://${zendeskDomain}/api/v2/tickets`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Basic ${zendeskAuth}`,
    //   },
    //   body: JSON.stringify(zendeskPayload),
    // });
    //
    // if (!zendeskResponse.ok) {
    //   const errorData = await zendeskResponse.json().catch(() => ({}));
    //   return NextResponse.json(
    //     { error: errorData.error || "Failed to create ticket" },
    //     { status: zendeskResponse.status }
    //   );
    // }
    //
    // const zendeskData = await zendeskResponse.json();
    // return NextResponse.json({ ticket_id: zendeskData.ticket.id });
    */
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
