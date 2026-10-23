import GUI, { TABS } from '../gui';
import { i18n } from '../localization';
import $ from 'jquery';
import teamMembers from '../../data/teamMembers';

const landing = {};

function createMemberElement(member, isDuplicate = false) {
    const item = document.createElement('div');
    item.className = 'team-member-item';
    if (isDuplicate) {
        item.setAttribute('aria-hidden', 'true');
    }

    const slot = document.createElement('div');
    slot.className = 'team-avatar-slot';

    const placeholder = document.createElement('div');
    placeholder.className = 'team-avatar-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.innerHTML = `
        <svg class="team-avatar-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    `;
    slot.appendChild(placeholder);

    if (member.image) {
        const probe = new Image();
        probe.onload = () => {
            const img = document.createElement('img');
            img.className = 'team-avatar-img';
            img.src = member.image;
            img.alt = isDuplicate ? '' : member.name;
            slot.appendChild(img);
        };
        probe.onerror = () => {
            // Gracefully ignore missing image: neutral placeholder remains displayed.
        };
        probe.src = member.image;
    }

    const name = document.createElement('span');
    name.className = 'team-member-name';
    name.textContent = member.name;

    item.appendChild(slot);
    item.appendChild(name);
    return item;
}

function initTeamMarquee() {
    const track = document.getElementById('team-marquee-track');
    if (!track || !Array.isArray(teamMembers) || teamMembers.length === 0) {
        return;
    }
    track.innerHTML = '';

    // Create 4 groups (2 matching pairs) so the track comfortably exceeds the width of any viewport (up to 4K),
    // ensuring a perfectly seamless, gapless infinite CSS loop from 0% to -50%.
    // Group 1 is accessible to screen readers, while duplicate groups have aria-hidden="true".
    for (let i = 0; i < 4; i++) {
        const isDuplicate = i > 0;
        const group = document.createElement('div');
        group.className = 'team-marquee-group';
        if (isDuplicate) {
            group.setAttribute('aria-hidden', 'true');
        }
        teamMembers.forEach((member) => {
            group.appendChild(createMemberElement(member, isDuplicate));
        });
        track.appendChild(group);
    }
}

landing.initialize = function (callback) {
    if (GUI.active_tab != 'landing') {
        GUI.active_tab = 'landing';
    }

    $('#content').load("./tabs/landing.html", () => {
        initTeamMarquee();
        function showLang(newLang) {
            bottomSection = $('.languageSwitcher');
            bottomSection.find('a').each(function(index) {
                const element = $(this);
                const languageSelected = element.attr('lang');
                if (newLang == languageSelected) {
                    element.removeClass('selected_language');
                    element.addClass('selected_language');
                } else {
                    element.removeClass('selected_language');
                }
            });
        }

        let bottomSection = $('.languageSwitcher');
        bottomSection.html(' <span i18n="language_choice_message"></span>');
        bottomSection.append(' <a href="#" i18n="language_default_pretty" lang="DEFAULT"></a>');
        const languagesAvailables = i18n.getLanguagesAvailables();

        languagesAvailables.forEach((element) => {
            bottomSection.append(` <a href="#" lang="${element}" i18n="language_${element}"></a>`);
        });

        bottomSection.find('a').each((index, element) => {
            $(element).click(() => {
                const languageSelected = $(element).attr('lang');
                if (!languageSelected) { return; }
                if (i18n.selectedLanguage != languageSelected) {
                    i18n.changeLanguage(languageSelected);
                    showLang(languageSelected);
                }
            });
        });

        showLang(i18n.selectedLanguage);
        // translate to user-selected language
        i18n.localizePage();

        GUI.content_ready(callback);
    });
};

landing.cleanup = function (callback) {
    if (callback) {
        callback();
    }
};

// TODO: remove after all is using modules
TABS.landing = landing;
export {
    landing,
};
