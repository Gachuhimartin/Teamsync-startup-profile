// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===== Dark/Light Mode Toggle =====
    const toggleThemeBtn = document.createElement('button');
    toggleThemeBtn.textContent = 'Toggle Theme';
    toggleThemeBtn.className = 'theme-toggle-btn';
    toggleThemeBtn.style.position = 'fixed';
    toggleThemeBtn.style.top = '10px';
    toggleThemeBtn.style.right = '10px';
    toggleThemeBtn.style.zIndex = '1000';
    document.body.prepend(toggleThemeBtn);

    // Apply theme from localStorage on load
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Toggle theme and save preference
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // ===== Audience Toggle Switch =====
    const audienceSwitch = document.createElement('div');
    audienceSwitch.className = 'audience-toggle';
    audienceSwitch.innerHTML = `
        <label class="switch">
            <input type="checkbox" id="audienceToggle">
            <span class="slider round"></span>
        </label>
        <span class="audience-label">For Students</span>
    `;
    document.querySelector('#section-about .about-content-left').appendChild(audienceSwitch);

    const audienceContent = document.createElement('div');
    audienceContent.className = 'audience-content';
    audienceContent.innerHTML = `
        <div class="audience-block student-block">Welcome, students! Here's how TeamSync helps you stay organized.</div>
        <div class="audience-block mentor-block" style="display: none;">Welcome, mentors! Here's how TeamSync supports your teams.</div>
    `;
    document.querySelector('#section-about .about-content-left').appendChild(audienceContent);

    document.getElementById('audienceToggle').addEventListener('change', function() {
        const isChecked = this.checked;
        document.querySelector('.student-block').style.display = isChecked ? 'none' : 'block';
        document.querySelector('.mentor-block').style.display = isChecked ? 'block' : 'none';
        document.querySelector('.audience-label').textContent = isChecked ? 'For Mentors' : 'For Students';
    });

    // ===== FAQ Accordion =====
    // Remove this section since it's already in the HTML
    // document.querySelectorAll('.faq-question').forEach((question, index) => {
    //     question.addEventListener('click', () => {
    //         const answer = question.nextElementSibling;
    //         answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    //     });
    // });

    // Improved FAQ Accordion (using existing HTML structure)
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            
            // Close other answers when one is opened
            if (answer.style.display === 'block') {
                document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
                    if (otherAnswer !== answer) {
                        otherAnswer.style.display = 'none';
                    }
                });
            }
        });
    });

    // Initialize all answers as hidden
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.display = 'none';
    });

    // ===== Contact Form Validation =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();
            const termsAccepted = this.querySelector('#accept-terms').checked;
            
            if (!email || !message) {
                alert('Please fill in all required fields.');
                e.preventDefault();
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                alert('Please enter a valid email address.');
                e.preventDefault();
            } else if (!termsAccepted) {
                alert('Please accept the terms and conditions.');
                e.preventDefault();
            }
        });
    }

    // ===== Smooth Scroll Navigation =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// AI Chat Functionality - Updated Version
document.addEventListener('DOMContentLoaded', function() {
    // ... (keep all your existing code)

    // ===== AI Chat Implementation =====
    const startupContext = `
    You are the AI assistant for TeamSync — a student-built platform for group project success.
    Founded by: Martin Gachuhi, John Mwangi, Lewis Kamau.
    Mission: Empower student teams to collaborate better, stay organized, and complete group work confidently.
    Services: TaskBoard, RoleSetter, AutoTracker.
    Vision: Become the go-to platform for academic team collaboration.
    Contact: info@teamsync.com or use the contact form.
    `;

    const chatContainer = document.querySelector('.ai-chat-messages');
    const inputField = document.querySelector('.ai-chat-input-placeholder');
    const sendBtn = document.querySelector('.ai-chat-send-button');
    const sampleBtns = document.querySelectorAll('.sample-btn');

    let messageHistory = [{ role: "system", content: startupContext }];

    // Initialize with a welcome message
    addMessage('ai', "Hello! I'm TeamSync's AI assistant. How can I help you with your group projects today?");

    // Make input field editable
    inputField.setAttribute("contenteditable", "true");

    // Send message handler
    sendBtn.addEventListener("click", async () => {
        const userInput = inputField.textContent.trim();
        if (!userInput) {
            alert("Please enter a message.");
            return;
        }

        addMessage("user", userInput);
        inputField.textContent = "";

        try {
            // Show typing indicator
            const typingIndicator = addMessage("ai", "...");
            
            const response = await puter.ai.chat({
                messages: [...messageHistory, { role: "user", content: userInput }]
            });

            // Remove typing indicator
            chatContainer.removeChild(typingIndicator);
            
            const aiMessage = response.choices[0].message.content;
            addMessage("ai", aiMessage);

            // Update message history
            messageHistory.push({ role: "user", content: userInput });
            messageHistory.push({ role: "assistant", content: aiMessage });
        } catch (err) {
            console.error("AI Error:", err);
            addMessage("ai", "I'm having trouble connecting right now. Please try again later.");
        }
    });

    // Sample question buttons
    sampleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            inputField.textContent = btn.textContent;
            sendBtn.click();
        });
    });

    // Handle Enter key
    inputField.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    function addMessage(sender, text) {
        const bubble = document.createElement("div");
        bubble.classList.add("ai-chat-bubble");
        bubble.classList.add(sender === "user" ? "user-bubble" : "ai-bubble");
        bubble.textContent = text;
        
        if (sender === 'user') {
            bubble.style.right = '40px';
            bubble.style.left = 'auto';
        } else {
            bubble.style.left = '40px';
            bubble.style.right = 'auto';
        }
        
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return bubble;
    }
});