import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const requestBody = await request.json();
  const { action, email, password, name, universityNumber, department } =
    requestBody;

  const supabase = createRouteHandlerClient({ cookies });

  if (action === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: data.user,
      message: "Logged in successfully",
    });
  }

  if (action === "signup") {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Then insert user data into the user table
    const { error: profileError } = await supabase.from("user").insert({
      userid: authData.user.id,
      name,
      email,
      password,
      phone,
      university_id: universityNumber,
      department,
      role: "user",
    });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: authData.user,
      message: "Signed up successfully",
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}


