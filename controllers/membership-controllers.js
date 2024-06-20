import { Membership } from "../models/membership-model";
import { handleErrors } from "../middlewares/errorHandler";
import cron from "node-cron";
import { sendEmail } from "../utils";

function generateMembershipId() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const paddedNumber = randomNumber.toString().padStart(4, "0");
  return `member${paddedNumber}`;
}

export const createMembership = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      membershipType,
      startDate,
      dueDate,
      monthlyDueDate,
      totalAmount,
      monthlyAmount,
    } = req.body;
    const existingMember = await Membership.findOne({ email })
    if (existingMember) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Member with this email already exists",
        });
    }
    const newMember = Membership({
      membershipId: generateMembershipId(),
      email,
      firstName,
      lastName,
      membershipType,
      startDate,
      dueDate,
      monthlyDueDate,
      totalAmount,
      monthlyAmount,
    });
    const savedMember = await newMember.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Member successfully created.",
        savedMember,
      });
  } catch (error) {
    handleErrors(error, res);
  }
};

// Cron job to check for upcoming due dates
cron.schedule("* * * * *", async () => {
  const today = new Date().toISOString().split("T")[0] 
  const reminderDate = new Date()
  reminderDate.setDate(reminderDate.getDate() + 7)
  const formattedReminderDate = reminderDate.toISOString().split("T")[0]

  console.log("today", today)
  console.log("reminder date", reminderDate)
  console.log("formatted reminder date", formattedReminderDate)

  try {
    const memberships = await Membership.find({
      $or: [
        {
          dueDate: { $eq: new Date(formattedReminderDate) },
          isFirstMonth: true,
        },
        { monthlyDueDate: { $eq: new Date(today) }, isFirstMonth: false },
      ],
    })
    console.log("memberships found:", memberships.length)

    if (memberships.length > 0) {
      memberships.forEach(async (membership) => {
        let subject, body;
        if (membership.isFirstMonth) {
          subject = `Fitness+ Membership Reminder - ${membership.membershipType}`
          html = `<p>Dear ${membership.firstName},</p>
          <p>This is a reminder that your annual membership fee of ${
            membership.totalAmount
          } and first month's add-on service charges are due on ${
            membership.dueDate.toISOString().split("T")[0]
          }.</p>
          <p>Thank you for being a part of Fitness+!</p>`
          membership.isFirstMonth = false
        } else {
          subject = `Fitness+ Membership Reminder - Add-on Services`
          html = `<p>Dear ${membership.firstName},</p>
          <p>This is a reminder that your add-on service charges of ${membership.monthlyAmount} are due this month.</p>
          <p>Thank you for being a part of Fitness+!</p>`
        }
        console.log("Sending email to:", membership.email)
        const email = membership.email

        await sendEmail(email, subject, body )

        await membership.save()
      })
    } else {
      console.log("No memberships found for reminder.")
    }
  } catch (error) {
    console.error("Error processing memberships:", error)
  }
})
