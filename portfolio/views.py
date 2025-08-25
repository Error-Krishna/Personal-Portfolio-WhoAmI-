# portfolio/views.py
from django.shortcuts import render, get_object_or_404
from django.http import  Http404

# --- Project Data ---
# In a larger application, this would come from a database.
# For this portfolio, a dictionary is a clean and simple way to manage project details.
PROJECTS_DATA = {
    'portfolio-website': {
        'title': 'My Portfolio Website',
        'tagline': 'A showcase of my skills, projects, and professional journey.',
        'video_file': 'portfolio-website.mp4', # <-- ADDED THIS
        'detailed_description': """
            <p>This portfolio is a full-fledged web application designed to be a central hub for all my professional work. Built with a Django backend and a dynamic frontend using Tailwind CSS and JavaScript, it goes beyond a simple static site.</p>
            <p class="mt-4">Key features include an interactive 3D particle background using three.js, a custom plasma cursor for a unique user experience, and smooth animations powered by Intersection Observer. The design is fully responsive, ensuring a seamless experience across all devices, from desktops to mobile phones.</p>
        """,
        'tech_stack': ['Django', 'HTML5', 'Tailwind CSS', 'JavaScript', 'Three.js'],
        'live_url': '#', # Link to the home page of the portfolio itself
        'github_url': 'https://github.com/Error-Krishna/portfolio'
    },
    'personal-finance-tracker': {
        'title': 'Personal Finance Tracker',
        'tagline': 'A full-stack web application for personal finance management.',
        'video_file': 'finance-tracker-demo.mp4', # <-- ADDED THIS
        'detailed_description': """
            <p>The Personal Finance Tracker is a robust tool designed to help users manage their finances effectively. It allows for tracking income and expenses, setting monthly or categorical budgets, and visualizing spending habits through interactive charts and graphs.</p>
            <p class="mt-4">The backend is powered by Flask, a Python web framework, and it uses MongoDB for flexible data storage. The frontend is built with vanilla JavaScript, making API calls to the backend to fetch and display data in real-time. This project demonstrates my ability to build a complete full-stack application from the ground up.</p>
        """,
        'tech_stack': ['Flask', 'MongoDB', 'JavaScript', 'Chart.js', 'HTML/CSS'],
        'live_url': 'https://finance-tracker-tymo.onrender.com/',
        'github_url': 'https://github.com/Error-Krishna/personal-finance-tracker'
    },
    'insightloop-business': {
        'title': 'InsightLoop Business',
        'tagline': 'A dynamic web application for business analysis and management.',
        'video_file': 'insightloop-business.mp4', # <-- You might need to create this video
        'detailed_description': """
            <p>InsightLoop is a business intelligence tool aimed at helping small to medium-sized businesses make data-driven decisions. It provides a dashboard for visualizing key performance indicators (KPIs), managing resources, and tracking project progress in real-time.</p>
            <p class="mt-4">This project showcases my skills in data visualization and building complex user interfaces. It integrates with various data sources and presents the information in an intuitive and actionable format, helping businesses to identify trends and optimize their operations.</p>
        """,
        'tech_stack': ['Django', 'Python', 'JavaScript', 'D3.js', 'PostgreSQL', 'REST APIs'],
        'live_url': 'https://insightloop.onrender.com/',
        'github_url': 'https://github.com/Error-Krishna/InsightLoop'
    },
    'video-showcase': {
        'type': 'gallery',
        'title': 'Video Editing Showcase',
        'tagline': 'A collection of my video editing work, from short films to motion graphics.',
        'videos': [
            {'type': 'local', 'title': 'Reel 1', 'video_url': 'reel1.mp4', 'description': 'A high-energy commercial edit.'},
            {'type': 'local', 'title': 'Reel 2', 'video_url': 'reel2.mp4', 'description': 'A professional and clean edit.'},
            {'type': 'local', 'title': 'Reel 3', 'video_url': 'reel3.mp4', 'description': 'A cinematic reel.'},
            # Add more videos here if needed
        ],
        'tech_stack': ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'Motion Graphics'],
    },
    'ui-ux-design': {
        'title': 'UI/UX and Graphic Design',
        'tagline': 'A portfolio of intuitive user interfaces and visually appealing graphic content.',
        'video_file': 'ui-ux-design.mp4', # <-- You might need to create this video
        'detailed_description': """
            <p>This collection represents my work in the field of digital design, focusing on creating user-centric and aesthetically pleasing experiences. It includes case studies on UI/UX projects for mobile apps and websites, showcasing my process from wireframing and prototyping to final visual design.</p>
            <p class="mt-4">Additionally, it features a range of graphic design work, such as branding assets, logos, and digital illustrations. My design philosophy is centered around clarity, usability, and creating a strong visual identity.</p>
        """,
        'tech_stack': ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'User Research', 'Prototyping'],
        'live_url': None,
        'github_url': None
    }
}


def home(request):
    """
    Renders the home page of the portfolio.
    """
    return render(request, 'home.html')

def project_detail(request, project_slug):
    """
    Renders the detailed page for a specific project.
    """
    try:
        project = PROJECTS_DATA[project_slug]
        context = {'project': project}

        if project.get('type') == 'gallery':
            return render(request, 'project_video_gallery.html', context)
        
        return render(request, 'project_detail.html', context)
        
    except KeyError:
        raise Http404("Project not found")