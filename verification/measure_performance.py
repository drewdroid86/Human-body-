import time
from playwright.sync_api import sync_playwright

def run(playwright):
    # Try to force software rendering to avoid GPU crashes in the headless env
    browser = playwright.chromium.launch(
        headless=True,
        args=[
            "--use-gl=swiftshader",
            "--enable-unsafe-swiftshader",
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    )
    page = browser.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    try:
        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Wait for the canvas to appear
        page.wait_for_selector("canvas", timeout=60000)
        print("Canvas found.")

        # Wait for the "Initializing Anatomy" text to appear (fallback)
        try:
            page.wait_for_selector("text=Initializing Anatomy", timeout=10000)
            print("Fallback visible, waiting for it to disappear...")
            # Wait for it to disappear (meaning content loaded)
            page.wait_for_selector("text=Initializing Anatomy", state="hidden", timeout=120000)
            print("Fallback disappeared, content should be ready.")
        except:
            print("Fallback not seen or already gone.")

        # Additional wait for post-processing and rendering
        # Software rendering is slow, so give it time
        print("Waiting for render...")
        time.sleep(20)

        page.screenshot(path="verification_baseline.png")
        print("Baseline screenshot captured.")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification_error.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
