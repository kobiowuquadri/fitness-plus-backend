import { Membership } from "../models/membership-model";
import { handleErrors } from "../middlewares/errorHandler";
import cron from 'node-cron'
import { sendEmail } from "../utils";

function generateMembershipId() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const paddedNumber = randomNumber.toString().padStart(4, '0') 
  return `member${paddedNumber}`
}

export const createMembership = async (req, res) => {
  
  try {
    const {email, firstName, lastName, membershipType, startDate, dueDate, monthlyDueDate, totalAmount, monthlyAmount} = req.body
    const existingMember = await Membership.findOne({email})
    if (existingMember) {
      return res
        .status(400)
        .json({ success: false, message: 'Member with this email already exists' })
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
      monthlyAmount
    })
    const savedMember = await newMember.save()
    res.status(201).json({success: true, message: "Member successfully created.", savedMember})
  } catch (error) {
    handleErrors(error, res)
  }
}


// Cron job to check for upcoming due dates
cron.schedule('* * * * *', async () => {
  console.log('Cron job triggered');
  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + 7);

  try {
    const memberships = await Membership.find({
      $or: [
        { dueDate: reminderDate, isFirstMonth: true },
        { monthlyDueDate: today, isFirstMonth: false },
      ],
    });

    memberships.forEach(async (membership) => {
      let subject, body, template, context;
      if (membership.isFirstMonth) {
        subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;
        body = `Dear ${membership.firstName},\n\nThis is a reminder that your annual membership fee of $${membership.totalAmount} and first month's add-on service charges are due on ${membership.dueDate}.\n\nThank you for being a part of Fitness+!`;
        template = 'firstMonthReminder'
        context = {
          firstName: membership.firstName,
          membershipType: membership.membershipType,
          totalAmount: membership.totalAmount,
          dueDate: membership.dueDate
        };
        membership.isFirstMonth = false;
      } else {
        subject = `Fitness+ Membership Reminder - Add-on Services`;
        body = `Dear ${membership.firstName},\n\nThis is a reminder that your add-on service charges of $${membership.monthlyAmount} are due this month.\n\nThank you for being a part of Fitness+!`;
        template = 'monthlyReminder' 
        context = {
          firstName: membership.firstName,
          monthlyAmount: membership.monthlyAmount
        };
      }

      await sendEmail(membership.email, subject, body, template, context);
      await membership.save();
    });
  } catch (error) {
    console.error('Error processing memberships:', error)
  }
});