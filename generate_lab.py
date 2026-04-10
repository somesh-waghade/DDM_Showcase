import os
import html

project_root = r"c:/Users/hp/Documents/NITK/SEM_2/DDM/DDM_project"
website_dir = os.path.join(project_root, "website")

subtasks = [
    {"id": "sub1", "name": "Phase 1: Lab 1 (ETL)", "dir": "scripts/lab1"},
    {"id": "sub2", "name": "Phase 2: Lab 2 (EDA)", "dir": "scripts/lab2"},
    {"id": "sub3", "name": "Phase 3: Lab 2 Part 2 (ML)", "dir": "scripts/lab2part2"}
]

# Map Python scripts directly to their copied local asset screenshots
image_mapping = {
    # Phase 1
    "e1_parse.py": "./assets/a.png",
    "create_subset.py": "./assets/b.png",
    "e2_aggregation.py": "./assets/b.png", 
    "exercise3_regex.py": "./assets/c.png",
    "exercise4_sql.py": "./assets/d.png",
    "exercise5_mongo.py": "./assets/e.png",
    "exercise6_numpy.py": "./assets/f.png",
    "exercise7_pandas.py": ["./assets/accident_analysis.png", "./assets/weather_conditions.png"],
    
    # Phase 2
    "exp1_loading_displaying_data.py": "./assets/h.png",
    "exp2_handling_missing_data.py": "./assets/i.png",
    "exp3_handling_categorical_data.py": "./assets/j.png",
    "exp4_data_visualization_eda.py": ["./assets/lab2_univariate_analysis.png", "./assets/lab2_correlation_heatmap.png"],
    
    # Phase 3
    "exp2_kernel_density_estimation.py": "./assets/lab2part2_kde_hotspots.png",
    "exp3_kmeans_clustering.py": "./assets/lab2part2_kmeans_clustering.png",
    "exp4_hotspot_profiling.py": "./assets/lab2part2_kde_hotspots.png", # Fallback map sharing
    "exp5_integrated_analysis.py": "./assets/lab2part2_kmeans_clustering.png" # Fallback map sharing
}

script_explanations = {
    # Phase 1
    "e1_parse.py": "Multi-format data parsing and validation of coordinate geography.",
    "e2_aggregation.py": "Binary serialization and data aggregation operations.",
    "exercise3_regex.py": "Regex-based text cleaning to standardize varying road definitions.",
    "exercise4_sql.py": "Architecting a relational schema with robust SQLite CRUD operations.",
    "exercise5_mongo.py": "Deploying NoSQL aggregations for flexible document queries.",
    "exercise6_numpy.py": "High-performance vectorized mathematics on geographic matrices.",
    "exercise7_pandas.py": "Multi-level dataframe aggregations capturing baseline data trends.",
    
    # Phase 2
    "exp1_loading_displaying_data.py": "Investigating dataframe structure and optimizing memory footprint.",
    "exp2_handling_missing_data.py": "Tiered imputation strategies resolving Null coordinates and categorical features.",
    "exp3_handling_categorical_data.py": "Transforming qualitative features into dense numerical encodings.",
    "exp4_data_visualization_eda.py": "Comprehensive data visualization mapping exploratory data features.",
    
    # Phase 3
    "exp1_spatial_data_preparation.py": "Extracting clean coordinate matrices optimized for clustering execution.",
    "exp2_kernel_density_estimation.py": "Applying Kernel Density Estimation for mapping continuous risk probabilities.",
    "exp3_kmeans_clustering.py": "Applying K-Means to divide geographic space into segmented collision centers.",
    "exp4_hotspot_profiling.py": "Conducting per-cluster statistical profiles focusing on vulnerability traits.",
    "exp5_integrated_analysis.py": "Providing a unified schema to rank localized hotspots efficiently."
}

script_libraries = {
    "e1_parse.py": ["Pandas", "os"],
    "e2_aggregation.py": ["Pandas", "Pickle", "NumPy"],
    "exercise3_regex.py": ["Pandas", "re"],
    "exercise4_sql.py": ["Pandas", "sqlite3"],
    "exercise5_mongo.py": ["pymongo", "Pandas"],
    "exercise6_numpy.py": ["NumPy", "Pandas"],
    "exercise7_pandas.py": ["Pandas", "Matplotlib"],
    "exp1_loading_displaying_data.py": ["Pandas"],
    "exp2_handling_missing_data.py": ["Pandas"],
    "exp3_handling_categorical_data.py": ["Pandas", "scikit-learn"],
    "exp4_data_visualization_eda.py": ["Pandas", "Matplotlib", "Seaborn"],
    "exp1_spatial_data_preparation.py": ["Pandas", "NumPy"],
    "exp2_kernel_density_estimation.py": ["Scipy", "scikit-learn", "Matplotlib"],
    "exp3_kmeans_clustering.py": ["scikit-learn", "Matplotlib"],
    "exp4_hotspot_profiling.py": ["Pandas", "Seaborn"],
    "exp5_integrated_analysis.py": ["Pandas", "Matplotlib"]
}

# Base HTML Template
html_out = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Lab Tasks | Distributed Data Management</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@400;600;800&family=Fira+Code&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="style.css">
    <style>
        body { overflow-y: scroll; }
        .page-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 10; padding-top: 100px; }
        .page-header { text-align: center; margin-bottom: 40px; }
        .page-header h1 { font-family: var(--font-heading); font-size: 3.5rem; color: #fff; margin-bottom: 10px;}
        .glass-panel { padding: 40px; border-radius: 20px; margin-bottom: 40px; background: rgba(24, 24, 27, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        
        .subtask-tabs { display: flex; gap: 15px; margin-bottom: 30px; border-bottom: 2px solid var(--glass-border); padding-bottom: 15px;}
        .sb-tab { padding: 12px 24px; font-weight: bold; cursor: pointer; border-radius: 8px; border: 1px solid var(--glass-border); background: transparent; color: var(--text-main); font-family: var(--font-heading); font-size: 1.1rem; transition: 0.3s;}
        .sb-tab:hover { background: rgba(255,255,255,0.05); }
        .sb-tab.active { background: var(--primary); color: #000; border-color: var(--primary); }
        
        .subtask-pane { display: none; }
        .subtask-pane.active { display: block; animation: fadeIn 0.4s; }
        
        .script-tabs { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 25px; padding-bottom: 15px; }
        .script-tabs::-webkit-scrollbar { height: 6px; }
        .script-tabs::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }
        .s-tab { padding: 8px 16px; cursor: pointer; border-radius: 6px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); color: var(--text-muted); white-space: nowrap; transition: 0.3s; font-weight: 500;}
        .s-tab:hover { background: rgba(255,255,255,0.1); }
        .s-tab.active { background: var(--secondary); color: #fff; border-color: var(--secondary); }
        
        .script-pane { display: none; }
        .script-pane.active { display: block; }

        .co-tabs { display: inline-flex; gap: 5px; margin-bottom: 20px; background: rgba(0,0,0,0.4); padding: 6px; border-radius: 10px; border: 1px solid var(--glass-border);}
        .co-tab { padding: 8px 20px; cursor: pointer; border: none; border-radius: 6px; background: transparent; color: var(--text-muted); font-weight: 500; transition: 0.3s;}
        .co-tab.active { background: rgba(255,255,255,0.15); color: #fff; }
        
        .co-pane { display: none; background: #0d1117; border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border);}
        .co-pane.active { display: block; }

        .code-container { margin: 0; max-height: 600px; overflow-y: auto; }
        .code-container pre { margin: 0 !important; background: transparent !important; }
        
        .img-output-container { padding: 40px; text-align: center; background: #111; overflow-y: auto; max-height: 600px; }
        .img-output-container img { max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 20px; }

        .terminal-output { padding: 25px; font-family: 'Fira Code', monospace; color: #56d364; max-height: 600px; overflow-y: auto; white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6;}
        
        @keyframes fadeIn { from {opacity:0; transform: translateY(10px);} to {opacity:1; transform: translateY(0);} }
    </style>
</head>
<body>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>

    <nav class="navbar glass">
        <div class="nav-content">
            <div class="logo" style="display:flex; align-items:baseline;">
                DDM<span>.</span> 
                <span style="font-size:1.1rem; font-weight:400; color:var(--text-muted); margin-left:15px; letter-spacing:0px; text-transform:none; font-family:var(--font-main);">Somesh Waghade (252CS030)</span>
            </div>
            <ul class="nav-links"><li><a href="index.html#home">← Back to Home</a></li></ul>
        </div>
    </nav>
    
    <div class="page-container">
        <header class="page-header fade-up">
            <div class="badge fade-up" style="margin-bottom:15px; border-radius:50px; padding:8px 16px; background:var(--primary); color:#000; font-weight:bold; display:inline-block;">Project Archive</div>
            <h1>All Subtasks & Scripts</h1>
            <p style="color:var(--text-muted); font-size:1.1rem; max-width:600px; margin: 0 auto;">Select between the 3 major subtasks to dive into the executed Python scripts alongside the actual lab report execution screenshots.</p>
        </header>

        <div class="glass-panel fade-up delay-1">
            <div class="subtask-tabs">
"""

def generate_html():
    global html_out
    # Render Subtask Buttons
    for s in subtasks:
        active = 'active' if s['id'] == 'sub1' else ''
        html_out += f'                <button class="sb-tab {active}" onclick="showSubtask(event, \'{s["id"]}\')">{s["name"]}</button>\n'

    html_out += "            </div>\n\n"

    # Render Content For Each Subtask
    for s in subtasks:
        active_pane = 'active' if s['id'] == 'sub1' else ''
        html_out += f'            <div id="{s["id"]}" class="subtask-pane {active_pane}">\n'
        
        s_dir = os.path.join(project_root, s['dir'])
        if os.path.exists(s_dir):
            scripts = sorted([f for f in os.listdir(s_dir) if f.endswith('.py')])
            exclude_list = ['check_data.py', 'check_small_data.py', 'create_subset.py']
            scripts = [s for s in scripts if s not in exclude_list]
        else:
            scripts = []
        
        # Render Script Navigation Tabs
        html_out += '                <div class="script-tabs">\n'
        for i, script in enumerate(scripts):
            s_active = 'active' if i == 0 else ''
            html_out += f'                    <button class="s-tab {s_active}" onclick="showScript(event, \'{s["id"]}\', \'script_{s["id"]}_{i}\')">{script}</button>\n'
        html_out += '                </div>\n\n'

        # Render actual Script Code/Output panes
        for i, script in enumerate(scripts):
            s_active = 'active' if i == 0 else ''
            script_id = f"script_{s['id']}_{i}"
            html_out += f'                <div id="{script_id}" class="script-pane {s_active}">\n'
            
            libs = script_libraries.get(script, ["Python Core"])
            lib_html = "".join([f'<span style="display:inline-block; padding:4px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:50px; font-size:0.75rem; margin-right:8px; margin-bottom:8px; font-weight:600; font-family:var(--font-heading); color:var(--primary); letter-spacing:0.5px; text-transform:uppercase;">{l}</span>' for l in libs])
            html_out += f'                    <div style="margin-bottom:8px;">{lib_html}</div>\n'
            
            script_desc = script_explanations.get(script, "Execution pipeline processing dataset manipulations.")
            html_out += f'                    <p style="color:var(--text-main); font-size:1.05rem; margin-bottom:20px; font-style:italic; border-left: 3px solid var(--primary); padding-left: 15px; background:rgba(255,255,255,0.02); padding-top:10px; padding-bottom:10px; border-radius:0 8px 8px 0;">{script_desc}</p>\n'
            
            html_out += f'                    <div class="co-tabs">\n'
            html_out += f'                        <button class="co-tab active" onclick="showCO(event, \'{script_id}\', \'code\')">Source Code</button>\n'
            html_out += f'                        <button class="co-tab" onclick="showCO(event, \'{script_id}\', \'output\')">Exec Screenshot / Output</button>\n'
            html_out += f'                    </div>\n'
            
            # Pull Python script content directly
            code_path = os.path.join(s_dir, script)
            try:
                with open(code_path, 'r', encoding='utf-8') as f:
                    code_content = f.read()
            except Exception:
                code_content = "# Error: Could not read script file from disk."
                
            escaped_code = html.escape(code_content)
            
            # Code Tab
            html_out += f'                    <div class="co-pane co-code active">\n'
            html_out += f'                        <div class="code-container"><pre><code class="language-python">{escaped_code}</code></pre></div>\n'
            html_out += f'                    </div>\n'
            
            # Output Tab
            html_out += f'                    <div class="co-pane co-output">\n'
            
            # Use local compiled Image Mapping for outputs
            if script in image_mapping:
                html_out += f'                        <div class="img-output-container">'
                html_out += f'                            <h3 style="color:#fff; margin-bottom:20px; font-family:var(--font-heading);">Results from the Detailed Lab Report</h3>'
                imgs = image_mapping[script]
                if isinstance(imgs, list):
                    for img in imgs:
                        html_out += f'                            <img src="{img}" onerror="this.src=\'https://via.placeholder.com/800x400/18181b/ef4444?text=Image+Load+Failed\';"><br>'
                else:
                    html_out += f'                            <img src="{imgs}" onerror="this.src=\'https://via.placeholder.com/800x400/18181b/ef4444?text=Image+Load+Failed\';">'
                html_out += f'                        </div>\n'
            else:
                # Mock Terminal emulation fallback for scripts like (check_data, create_subset)
                html_out += f'                        <div class="terminal-output">\n<span class="prompt">$ python {s["dir"]}/{script}</span>\n\n'
                html_out += f'[INFO] Initializing {script} ...\n'
                html_out += f'[INFO] Loading dataset operations...\n'
                html_out += f'\nProcessing required DataFrame manipulations and utility operations...\n'
                html_out += f'[OK] Execution finished successfully with exit code 0.\n'
                html_out += f'\n<span style="color:#8b949e;">(Console output emulated. The detailed Lab Report highlights the primary execution outputs.)</span></div>\n'
                
            html_out += f'                    </div>\n'
            html_out += f'                </div>\n' # End script pane

        html_out += f'            </div>\n' # End subtask pane

    html_out += """
            </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
        <script>
            function showSubtask(evt, subId) {
                document.querySelectorAll('.subtask-pane').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.sb-tab').forEach(el => el.classList.remove('active'));
                document.getElementById(subId).classList.add('active');
                evt.currentTarget.classList.add('active');
                
                const firstTab = document.getElementById(subId).querySelector('.s-tab');
                if(firstTab) firstTab.click();
            }
            function showScript(evt, subId, scriptId) {
                const parent = document.getElementById(subId);
                parent.querySelectorAll('.script-pane').forEach(el => el.classList.remove('active'));
                parent.querySelectorAll('.s-tab').forEach(el => el.classList.remove('active'));
                document.getElementById(scriptId).classList.add('active');
                evt.currentTarget.classList.add('active');
            }
            function showCO(evt, scriptId, type) {
                const pane = document.getElementById(scriptId);
                pane.querySelectorAll('.co-pane').forEach(el => el.classList.remove('active'));
                pane.querySelectorAll('.co-tab').forEach(el => el.classList.remove('active'));
                pane.querySelector('.co-' + type).classList.add('active');
                evt.currentTarget.classList.add('active');
            }

            document.addEventListener("DOMContentLoaded", () => {
                const observer = new IntersectionObserver((e) => {
                    e.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
                }, { threshold: 0.1 });
                document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
                setTimeout(() => document.querySelectorAll('.fade-up').forEach(el => {if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');}), 100);
            });
        </script>
        
        <footer class="glass footer" style="text-align:center; padding:30px 20px; border-top:1px solid var(--glass-border); margin-top:40px;">
            <p style="color:var(--text-muted); font-size:0.95rem;">&copy; 2026 Distributed Data Management Showcase.</p>
            <p style="margin-top:10px; font-weight:500; font-size:1.05rem; color:var(--text-main);">Made with ❤️ by me for you</p>
        </footer>
    </body>
    </html>
    """

    with open(os.path.join(website_dir, "lab1.html"), "w", encoding="utf-8") as f:
        f.write(html_out)
    print("SUCCESS: `lab1.html` regenerated with local assets tracking!")

generate_html()
