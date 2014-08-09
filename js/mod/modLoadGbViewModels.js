define([
	'vm/gb/vmLogin',
	'vm/gb/vmFooter',
	'vm/gb/vmHeader',
	'vm/gb/vmGradebooks',
	'vm/gb/vmStudents',
	'vm/gb/vmClasses',
	'vm/gb/vmCategories',
	'vm/gb/vmAssignments',
	'vm/gb/vmStudentInfo',
	'vm/gb/vmGradebookInfo',
	'vm/gb/vmClassInfo',
	'vm/gb/vmCategoryInfo',
	'vm/gb/vmContacts',
	'vm/gb/vmContactEmails',
	'vm/gb/vmNotes',
	'vm/gb/vmEnrollment',
	'vm/gb/vmGradeSystemScale',
	'vm/gb/vmStudentEnrollment',
	'vm/gb/vmAssignmentInfo',
	'vm/gb/vmCategoriesInClass',
	'vm/gb/vmMyAccount',
	'vm/gb/vmRecord',
	'vm/gb/vmEmail',
	'vm/gb/vmStudentProgressReport',
	'vm/gb/vmImport1',
	'vm/gb/vmImport2',
	'vm/gb/vmImport3',
	'vm/gb/vmExport',
	// 'vm/gb/vmScheduleNames',
	// 'vm/gb/vmScheduleNameInfo',
	// 'vm/gb/vmScheduleTimes',
	// 'vm/gb/vmScheduleTimeInfo',
	'vm/gb/vmStudentRfid',
	'vm/gb/vmDailyAttendance'
], function (
	VMLogin,
	VMFooter,
	VMHeader,
	VMGradebooks,
	VMStudents,
	VMClasses,
	VMCategories,
	VMAssignments,
	VMStudentInfo,
	VMGradebookInfo,
	VMClassInfo,
	VMCategoryInfo,
	VMContacts,
	VMContactEmails,
	VMNotes,
	VMEnrollment,
	VMGradeSystemScale,
	VMStudentEnrollment,
	VMAssignmentInfo,
	VMCategoriesInClass,
	VMMyAccount,
	VMRecord,
	VMEmail,
	VMStudentProgressReport,
	VMImport1,
	VMImport2,
	VMImport3,
	VMExport,
	// VMScheduleNames,
	// VMScheduleNameInfo,
	// VMScheduleTimes,
	// VMScheduleTimeInfo,
	VMStudentRfid,
	VMDailyAttendance
) {
	ko.applyBindings(new VMLogin(), document.getElementById('login'));
	ko.applyBindings(new VMFooter(), document.getElementById('footer'));
	ko.applyBindings(new VMHeader(), document.getElementById('header'));
	ko.applyBindings(new VMGradebooks(), document.getElementById('vmGradebooks'));
	ko.applyBindings(new VMStudents(), document.getElementById('vmStudents'));
	ko.applyBindings(new VMClasses(), document.getElementById('vmClasses'));
	ko.applyBindings(new VMCategories(), document.getElementById('vmCategories'));
	ko.applyBindings(new VMAssignments(), document.getElementById('vmAssignments'));
	ko.applyBindings(new VMStudentInfo(), document.getElementById('vmStudentInfo'));
	ko.applyBindings(new VMGradebookInfo(), document.getElementById('vmGradebookInfo'));
	ko.applyBindings(new VMClassInfo(), document.getElementById('vmClassInfo'));
	ko.applyBindings(new VMCategoryInfo(), document.getElementById('vmCategoryInfo'));
	ko.applyBindings(new VMContacts(), document.getElementById('vmContacts'));
	ko.applyBindings(new VMContactEmails(), document.getElementById('vmContactEmails'));
	ko.applyBindings(new VMNotes(), document.getElementById('vmNotes'));
	ko.applyBindings(new VMEnrollment(), document.getElementById('vmEnrollment'));
	ko.applyBindings(new VMGradeSystemScale(), document.getElementById('vmGradeSystemScale'));
	ko.applyBindings(new VMStudentEnrollment(), document.getElementById('vmStudentEnrollment'));
	ko.applyBindings(new VMAssignmentInfo(), document.getElementById('vmAssignmentInfo'));
	ko.applyBindings(new VMCategoriesInClass(), document.getElementById('vmCategoriesInClass'));
	ko.applyBindings(new VMMyAccount(), document.getElementById('vmMyAccount'));
	ko.applyBindings(new VMRecord(), document.getElementById('vmRecord'));
	ko.applyBindings(new VMEmail(), document.getElementById('vmEmail'));
	ko.applyBindings(new VMStudentProgressReport(), document.getElementById('vmStudentProgressReport'));
	ko.applyBindings(new VMImport1(), document.getElementById('vmImport1'));
	ko.applyBindings(new VMImport2(), document.getElementById('vmImport2'));
	ko.applyBindings(new VMImport3(), document.getElementById('vmImport3'));
	ko.applyBindings(new VMExport(), document.getElementById('vmExport'));
	// ko.applyBindings(new VMScheduleNames(), document.getElementById('vmScheduleNames'));
	// ko.applyBindings(new VMScheduleNameInfo(), document.getElementById('vmScheduleNameInfo'));
	// ko.applyBindings(new VMScheduleTimes(), document.getElementById('vmScheduleTimes'));
	// ko.applyBindings(new VMScheduleTimeInfo(), document.getElementById('vmScheduleTimeInfo'));
	ko.applyBindings(new VMStudentRfid(), document.getElementById('vmStudentRfid'));
	ko.applyBindings(new VMDailyAttendance(), document.getElementById('vmDailyAttendance'));
});

