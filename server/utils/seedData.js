const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const HealthCamp = require('../models/HealthCamp');
const User = require('../models/User');

const seedData = async () => {
  try {
    // 1. Seed Demo Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('[Seed] Admin account created: admin / admin123');
    }

    // 2. Seed a demo normal-user account
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedUserPassword = await bcrypt.hash('user123', 10);
      await User.create({
        fullName: 'Demo User',
        email: 'user@healthcamp.com',
        password: hashedUserPassword,
        mobileNumber: '9876543210',
      });
      console.log('[Seed] Demo user account created: user@healthcamp.com / user123');
    }

    // 3. Seed Sample Health Camps
    const campCount = await HealthCamp.countDocuments();
    if (campCount === 0) {
      const sampleCamps = [
        {
          campNameEnglish: 'Comprehensive Free Eye Check-up & Care Camp',
          campNameTelugu: 'సమగ్ర ఉచిత నేత్ర వైద్య పరీక్ష శిబిరం',
          organizerName: 'Sankara Eye Foundation & Lions Club',
          campType: 'Eye Check-up',
          date: '2026-08-25',
          startTime: '09:00 AM',
          endTime: '04:00 PM',
          location: 'Guntur Community Centre',
          address: 'Main Road, Old Bus Stand Area, Guntur, AP - 522001',
          descriptionEnglish: 'Free eye test, vision assessment, refraction check, and free distribution of prescribed reading glasses for senior citizens and low-income families.',
          descriptionTelugu: 'ఉచిత కంటి పరీక్ష, దృష్టి నివారణ పరీక్షలు మరియు సీనియర్ సిటిజన్లు మరియు పేద కుటుంబాలకు ఉచితంగా రీడింగ్ గ్లాసెస్ పంపిణీ చేయబడతాయి.',
          servicesEnglish: 'Cataract screening, Vision testing, Free prescription glasses, Doctor consultation',
          servicesTelugu: 'కంటి పరిక్షలు, ఉచిత కళ్ళజోళ్ళు పంపిణీ, వైద్య సలహాలు, కాటరాక్ట్ స్క్రీనింగ్',
          contactNumber: '9848012345',
          maxParticipants: 100,
          status: 'Upcoming',
        },
        {
          campNameEnglish: 'General Health & Preventive Wellness Camp',
          campNameTelugu: 'సాధారణ ఆరోగ్య మరియు నివారణ సంరక్షణ శిబిరం',
          organizerName: 'NTR Trust & Apollo Reach Foundation',
          campType: 'General Health Check-up',
          date: '2026-08-30',
          startTime: '08:30 AM',
          endTime: '02:00 PM',
          location: 'Vijayawada Community Hall',
          address: 'Bunder Road, Near Benz Circle, Vijayawada, AP - 520010',
          descriptionEnglish: 'Comprehensive physical wellness checkup including blood pressure, pulse, body mass index, general physician examination, and basic health counselling.',
          descriptionTelugu: 'బిపి, పల్స్, శరీర బరువు పరీక్షలు మరియు నిపుణులైన డాక్టర్లతో సాధారణ ఆరోగ్య పరీక్షలు మరియు ఉచిత ఔషధ సలహాలు.',
          servicesEnglish: 'BP monitoring, Weight & BMI check, General physician advice, Basic medicines',
          servicesTelugu: 'బిపి పరీక్ష, సాధారణ వైద్య సలహా, ఉచిత అవగాహన కరపత్రాలు',
          contactNumber: '9849023456',
          maxParticipants: 150,
          status: 'Upcoming',
        },
        {
          campNameEnglish: 'Community Dental Hygiene & Care Camp',
          campNameTelugu: 'కమ్యూనిటీ దంత ఆరోగ్య సంరక్షణ శిబిరం',
          organizerName: 'Government Dental College & Indian Dental Association',
          campType: 'Dental Camp',
          date: '2026-09-05',
          startTime: '10:00 AM',
          endTime: '03:30 PM',
          location: 'Tenali Government School Campus',
          address: 'Station Road, Tenali, AP - 522201',
          descriptionEnglish: 'Free dental check-up, cavity examination, oral hygiene awareness, and scaling guidance by certified dentists.',
          descriptionTelugu: 'ఉచిత దంత పరీక్షలు, పిప్పి పళ్ళ తనిఖీ, నోటి పరిశుభ్రత పై అవగాహన మరియు ఉచిత పేస్ట్, బ్రష్ పంపిణీ.',
          servicesEnglish: 'Dental cavity check, Tooth decay consultation, Free dental hygiene kit',
          servicesTelugu: 'దంత తనిఖీ, దంత వైద్య సలహాలు, ఉచిత డెంటల్ కిట్',
          contactNumber: '9847034567',
          maxParticipants: 80,
          status: 'Upcoming',
        },
        {
          campNameEnglish: 'Voluntary Blood Donation & Screening Camp',
          campNameTelugu: 'స్వచ్ఛంద రక్తదాన మరియు రక్త గ్రూప్ పరీక్ష శిబిరం',
          organizerName: 'Red Cross Society & Youth Welfare Club',
          campType: 'Blood Donation Camp',
          date: '2026-09-10',
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          location: 'Kakinada Town Hall Grounds',
          address: 'Main Bazaar Road, Kakinada, AP - 533001',
          descriptionEnglish: 'Voluntary blood donation drive for local blood banks. Free blood grouping test and hemoglobin test provided for all participants.',
          descriptionTelugu: 'స్థానిక ప్రభుత్వ ఆసుపత్రి రక్తం కొరత తీర్చడానికి స్వచ్ఛంద రక్తదానం. దాతలకు ఉచిత రక్త గ్రూపింగ్ మరియు సర్టిఫికేట్.',
          servicesEnglish: 'Blood group testing, Hemoglobin level test, Refreshments, Donor certificate',
          servicesTelugu: 'రక్త గ్రూప్ పరీక్ష, హెమోగ్లోబిన్ పరీక్ష, దాతల సర్టిఫికేట్',
          contactNumber: '9846045678',
          maxParticipants: 120,
          status: 'Upcoming',
        },
        {
          campNameEnglish: 'Diabetes Screening & BP Awareness Drive',
          campNameTelugu: 'మధుమేహం (షుగర్) మరియు బిపి పరీక్ష శిబిరం',
          organizerName: 'Rao Healthcare Foundation & Rotary Club',
          campType: 'Diabetes Screening',
          date: '2026-09-15',
          startTime: '07:30 AM',
          endTime: '01:00 PM',
          location: 'Rajahmundry Municipal Park Center',
          address: 'Kotipalli Bus Stand Road, Rajahmundry, AP - 533101',
          descriptionEnglish: 'Early morning fasting blood sugar check, random blood glucose test, and diabetic diet counselling by clinical nutritionists.',
          descriptionTelugu: 'ఉదయం రక్తం షుగర్ స్థాయి పరీక్షలు, డయాబెటిస్ నివారణ చిట్కాలు మరియు ఆహార నియమాల అవగాహన.',
          servicesEnglish: 'Random Blood Sugar (RBS), Blood Pressure check, Dietitian advice',
          servicesTelugu: 'షుగర్ పరీక్ష, బిపి తనిఖీ, ఆహార పద్ధతుల ఉచిత సలహా',
          contactNumber: '9845056789',
          maxParticipants: 90,
          status: 'Upcoming',
        },
      ];

      await HealthCamp.insertMany(sampleCamps);
      console.log('[Seed] Sample health camps populated successfully.');
    }
  } catch (error) {
    console.error('[Seed] Data seeding error:', error.message);
  }
};

module.exports = seedData;
