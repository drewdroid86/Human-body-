from playwright.sync_api import sync_playwright

def verify_sidebar_tabs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        # Navigate to the app
        page.goto("http://localhost:3000")

        # Wait for the sidebar to be visible
        # We can check for the "Anatomy Explorer" text which is in the Sidebar
        page.wait_for_selector("text=Anatomy Explorer", timeout=10000)

        # Check if the tabs are present and clickable
        # Systems tab
        systems_tab = page.get_by_role("button", name="Systems")
        if systems_tab.is_visible():
            print("Systems tab is visible")
            systems_tab.click()
            # Verify Systems content is shown (e.g. "Organ Systems" header)
            page.wait_for_selector("text=Organ Systems", timeout=10000)
            print("Systems content visible")
            page.wait_for_timeout(500)
            page.screenshot(path="verification/systems_tab.png")
            print("Captured systems_tab.png")

        # Skeletal tab
        skeletal_tab = page.get_by_role("button", name="Skeletal")
        if skeletal_tab.is_visible():
            print("Skeletal tab is visible")
            # Force click as sometimes elements might be covered or animating
            skeletal_tab.click(force=True)
            # Verify Skeletal content is shown (e.g. "Skeletal System" header)
            page.wait_for_selector("text=Skeletal System", timeout=10000)
            print("Skeletal content visible")
            page.wait_for_timeout(500)
            page.screenshot(path="verification/skeletal_tab.png")
            print("Captured skeletal_tab.png")

        # Diseases tab
        diseases_tab = page.get_by_role("button", name="Diseases")
        if diseases_tab.is_visible():
            print("Diseases tab is visible")
            diseases_tab.click(force=True)
            # Verify Diseases content is shown (e.g. "Conditions & Pathology" header)
            page.wait_for_selector("text=Conditions & Pathology", timeout=10000)
            print("Diseases content visible")
            page.wait_for_timeout(500)
            page.screenshot(path="verification/diseases_tab.png")
            print("Captured diseases_tab.png")

        browser.close()

if __name__ == "__main__":
    verify_sidebar_tabs()
