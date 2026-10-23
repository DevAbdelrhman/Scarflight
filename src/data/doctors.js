/**
 * Doctors Data Configuration
 *
 * This file configures the two fixed doctor profiles displayed in the
 * Upper Hero section of the homepage directly above the scrolling team marquee.
 *
 * How to edit:
 * - Update 'name': The doctor's display name.
 * - Update 'role' / 'specialty': The doctor's specialty or role title.
 * - Place real portrait images in 'src/images/team/' using the filenames below:
 *     - Doctor 1: 'src/images/team/doctor-1.jpg'
 *     - Doctor 2: 'src/images/team/doctor-2.jpg'
 *   Ensure the 'image' property points to './images/team/doctor-1.jpg' and './images/team/doctor-2.jpg'.
 *   If an image file is missing or not yet added, a clean neutral placeholder will be shown automatically.
 */

export const doctors = [
    {
        id: 'Dr. Amr',
        name: 'Dr. Amr',
        role: 'Project Supervision',
        specialty: 'Project Supervision',
        image: './images/team/Photo11.jpg',
    },
    {
        id: 'ُENG .Ahmed Shawqi',
        name: 'ENG .Ahmed Shawqi',
        role: 'Teaching Assistant',
        specialty: 'Teaching Assistant',
        image: './images/team/Photo12.jpg',
    },
];

export default doctors;
